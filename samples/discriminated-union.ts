type Shape = Circle | Rectangle | Triangle

interface Circle {
  kind: 'circle'
  radius: number
}

interface Rectangle {
  kind: 'rectangle'
  width: number
  height: number
}

interface Triangle {
  kind: 'triangle'
  a: number
  b: number
  c: number
}

function getPerimeter(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return 2 * Math.PI * shape.radius
    case 'rectangle': return 2 * (shape.width + shape.height)
    case 'triangle': return (shape.a + shape.b + shape.c)
    default: return assertNever(shape)
  }
}