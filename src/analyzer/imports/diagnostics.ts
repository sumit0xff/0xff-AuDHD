import { ImportDiagnostics } from './types';

export class DiagnosticsCollector {
  private diag: ImportDiagnostics = {
    resolvedImports: 0,
    unresolvedImports: 0,
    externalPackages: 0,
    localImports: 0,
    dynamicImports: 0,
    typeOnlyImports: 0,
  };

  public recordResolved(isExternal: boolean, isDynamic: boolean, isTypeOnly: boolean) {
    this.diag.resolvedImports++;
    if (isExternal) this.diag.externalPackages++;
    else this.diag.localImports++;
    
    if (isDynamic) this.diag.dynamicImports++;
    if (isTypeOnly) this.diag.typeOnlyImports++;
  }

  public recordUnresolved() {
    this.diag.unresolvedImports++;
  }

  public get() {
    return { ...this.diag };
  }
}
