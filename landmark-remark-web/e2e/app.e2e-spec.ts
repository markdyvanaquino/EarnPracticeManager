import { LandmarkRemarkWebPage } from './app.po';

describe('landmark-remark-web App', function() {
  let page: LandmarkRemarkWebPage;

  beforeEach(() => {
    page = new LandmarkRemarkWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
