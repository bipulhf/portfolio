import {
  Color,
  Group,
  InstancedMesh,
  Matrix4,
  Object3D,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";

type Point = readonly [number, number, number];

/** Static decoration batches by geometry and material, regardless of location. */
export function createDetailBatches(root: Group) {
  const batches = new Map<
    string,
    {
      geometry: BufferGeometry;
      material: Material;
      matrices: Matrix4[];
      colors: Color[];
      shadow: boolean;
    }
  >();
  const dummy = new Object3D();
  const up = new Vector3(0, 1, 0);
  const direction = new Vector3();
  function record(
    geometry: BufferGeometry,
    material: Material,
    color: string,
    shadow: boolean,
  ) {
    const key = `${geometry.uuid}/${material.uuid}/${shadow}`;
    let batch = batches.get(key);
    if (!batch) {
      batch = { geometry, material, matrices: [], colors: [], shadow };
      batches.set(key, batch);
    }
    dummy.updateMatrix();
    batch.matrices.push(dummy.matrix.clone());
    batch.colors.push(new Color(color));
  }
  function add(
    geometry: BufferGeometry,
    material: Material,
    position: Point,
    scale: Point,
    rotation: Point = [0, 0, 0],
    color = "#ffffff",
    shadow = true,
  ) {
    dummy.position.set(...position);
    dummy.scale.set(...scale);
    dummy.rotation.set(...rotation);
    record(geometry, material, color, shadow);
  }
  function beam(
    geometry: BufferGeometry,
    material: Material,
    from: Point,
    to: Point,
    radius: number,
  ) {
    direction.set(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
    dummy.position.set(
      (from[0] + to[0]) / 2,
      (from[1] + to[1]) / 2,
      (from[2] + to[2]) / 2,
    );
    dummy.scale.set(radius, direction.length(), radius);
    dummy.quaternion.setFromUnitVectors(up, direction.normalize());
    record(geometry, material, "#ffffff", true);
  }
  function finish() {
    for (const batch of batches.values()) {
      const mesh = new InstancedMesh(
        batch.geometry,
        batch.material,
        batch.matrices.length,
      );
      batch.matrices.forEach((matrix, i) => {
        mesh.setMatrixAt(i, matrix);
        mesh.setColorAt(i, batch.colors[i]);
      });
      mesh.castShadow = batch.shadow;
      mesh.receiveShadow = true;
      // Decorations must not intercept the landmark and project hit targets.
      mesh.raycast = () => {};
      mesh.computeBoundingSphere();
      mesh.name = "Island detail batch";
      root.add(mesh);
    }
  }
  return { add, beam, finish };
}
