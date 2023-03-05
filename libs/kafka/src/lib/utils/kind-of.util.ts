export function kindOf(inp: any) {
  return Object.prototype.toString.call(inp).slice(8, -1).toLowerCase();
}
