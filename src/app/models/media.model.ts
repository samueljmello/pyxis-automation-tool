export class MediaModel {

  public object: any;
  public id: string;
  public title: string;
  public image: string;
  public link: string;
  public date: string;

  constructor(objectToMap: any) {
    this.object = objectToMap;
    this.id = objectToMap.id;
    this.image = objectToMap.images.thumbnail.url;
    this.link = objectToMap.link;
    this.date = objectToMap.created_time;

    if (objectToMap.caption && objectToMap.caption.text) {
      this.title = objectToMap.caption.text
    } else {
      this.title = objectToMap.id + ' (no caption)';
    }
  }

}