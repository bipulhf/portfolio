import {
  BufferGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Shape,
} from "three";

/**
 * Builds a plump, pleated/scalloped pine bough skirt matching clay-diorama
 * miniature pine trees (unit height ~1.0, base radius ~1.0).
 */
export function createFlutedPineTierGeometry(lobes = 11): BufferGeometry {
  const radialSegments = lobes * 6;
  const heightRings = 15;
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= heightRings; i++) {
    const v = i / heightRings; // 0 = apex, 1 = tucked bottom center
    let y: number;
    let baseRadius: number;
    let fluteDepth: number;

    if (v <= 0.78) {
      const t = v / 0.78;
      // Bell-curved cone skirt that flares gently near the hem
      y = 0.52 - t * 0.88;
      baseRadius = 0.03 + Math.pow(t, 0.86) * 0.94;
      fluteDepth = 0.165 * Math.sin(Math.pow(t, 0.75) * Math.PI * 0.92);
    } else {
      // Plump rounded underside lip curling cleanly inward
      const u = (v - 0.78) / 0.22;
      const angle = u * (Math.PI * 0.5);
      y = -0.36 - Math.sin(angle) * 0.13;
      baseRadius = Math.cos(angle) * 0.97 * (1 - u * 0.65);
      fluteDepth = 0.15 * (1 - u);
    }

    for (let j = 0; j <= radialSegments; j++) {
      const theta = (j / radialSegments) * Math.PI * 2;
      // Rounded outer ribs + crisp soft valleys like sculpted clay pine boughs
      const wave = Math.cos(lobes * theta);
      const shapedWave = wave >= 0 ? Math.pow(wave, 0.75) : -Math.pow(-wave, 1.25);
      const r = i === 0 ? 0 : Math.max(0.001, baseRadius * (1 + fluteDepth * shapedWave));
      // Slight vertical scallop droop on each outer lobe tip
      const scallopY =
        i === 0 ? y : y - Math.max(0, wave) * 0.045 * Math.sin(Math.min(1, v / 0.82) * Math.PI);

      positions.push(r * Math.cos(theta), scallopY, r * Math.sin(theta));
    }
  }

  const stride = radialSegments + 1;
  for (let i = 0; i < heightRings; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * stride + j;
      const b = a + 1;
      const c = (i + 1) * stride + j;
      const d = c + 1;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Builds the main draped A-frame tent shell extruded along Z, with gentle
 * catenary sag along both canvas slopes and soft clay bevels.
 */
export function createTentShellGeometry(
  halfWidth = 1.92,
  height = 2.72,
  length = 3.7,
): ExtrudeGeometry {
  const wallThickness = 0.14;
  const shape = new Shape();

  // Outer left stake -> curved left slope -> rounded ridge -> curved right slope -> right stake
  shape.moveTo(-halfWidth, 0);
  shape.quadraticCurveTo(-halfWidth * 0.44, height * 0.46, -0.08, height - 0.04);
  shape.quadraticCurveTo(0, height + 0.03, 0.08, height - 0.04);
  shape.quadraticCurveTo(halfWidth * 0.44, height * 0.46, halfWidth, 0);

  // Inner return path forming thick canvas shell
  shape.lineTo(halfWidth - wallThickness * 1.35, 0);
  shape.quadraticCurveTo(
    (halfWidth - wallThickness) * 0.44,
    (height - wallThickness) * 0.45,
    0,
    height - wallThickness * 1.45,
  );
  shape.quadraticCurveTo(
    -(halfWidth - wallThickness) * 0.44,
    (height - wallThickness) * 0.45,
    -halfWidth + wallThickness * 1.35,
    0,
  );
  shape.closePath();

  const geometry = new ExtrudeGeometry(shape, {
    depth: length,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.045,
    bevelThickness: 0.055,
    curveSegments: 18,
  });
  geometry.translate(0, 0, -length / 2);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Builds one side of the parted front tent gable flap (left or right).
 */
export function createTentFrontFlapGeometry(
  side: -1 | 1,
  halfWidth = 1.88,
  height = 2.65,
): ExtrudeGeometry {
  const shape = new Shape();
  if (side === -1) {
    shape.moveTo(-halfWidth, 0);
    shape.quadraticCurveTo(-halfWidth * 0.44, height * 0.46, -0.03, height - 0.08);
    shape.lineTo(-0.04, height * 0.66);
    shape.quadraticCurveTo(-0.26, height * 0.3, -0.58, 0);
    shape.closePath();
  } else {
    shape.moveTo(halfWidth, 0);
    shape.quadraticCurveTo(halfWidth * 0.44, height * 0.46, 0.03, height - 0.08);
    shape.lineTo(0.04, height * 0.66);
    shape.quadraticCurveTo(0.26, height * 0.3, 0.58, 0);
    shape.closePath();
  }

  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.09,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    curveSegments: 14,
  });
  geometry.computeVertexNormals();
  return geometry;
}
