class PagesForMenu {
  constructor(){
    this.pages = {};
    this.pages.LEVEL1 = [];
    this.pages.LEVEL2 = [];
    this.reset();
  }
  reset(){
    this.pages.LEVEL1 = [];
    this.pages.LEVEL2 = [];
    this.pages.LEVEL3 = [];
  }
  
 /*  get Pages() {
    return this.pages;
  } */
  getPages(level) {
    return this.pages[level];
  }
  setPages(p,level) {
    this.reset();
    this.pages[level] = p;
  }
}
export default new PagesForMenu();