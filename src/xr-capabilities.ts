export interface EnvironmentBlendSession {
  readonly environmentBlendMode?: XRSession["environmentBlendMode"];
}

export function xrSessionUsesPassthrough(
  session: EnvironmentBlendSession,
): boolean {
  return (
    session.environmentBlendMode === "alpha-blend" ||
    session.environmentBlendMode === "additive"
  );
}
