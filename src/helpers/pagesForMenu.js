class PagesForMenu {
  constructor(){
    this.pages = [];
  }
  getPages() {
    return this.pages;
  }
  setPages(p) {
    this.pages = p;
  }
}
export default new PagesForMenu();