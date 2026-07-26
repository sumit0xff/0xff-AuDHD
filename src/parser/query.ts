export class QueryExecutor {
  private compiledQueries = new Map<string, Map<string, any>>();

  public execute(language: any, languageId: string, queryString: string, rootNode: any): any[] {
    try {
      let langQueries = this.compiledQueries.get(languageId);
      if (!langQueries) {
        langQueries = new Map();
        this.compiledQueries.set(languageId, langQueries);
      }

      let query = langQueries.get(queryString);
      if (!query) {
        query = { captures: () => [] };
        langQueries.set(queryString, query);
      }

      return query.captures(rootNode);
    } catch (err) {
      return [];
    }
  }
}
