import {JSONSerializable, JSONSerializableKeys} from './utils/JSONSerializable';
import {ID, ISODate, Nullable} from './utils/UtilityTypes';
import {GenericEntity} from '@models/utils/GenericEntity';

export class Post extends GenericEntity<Post> {
    private _id: ID;
    private _author: string;
    private _title: string;
    private _body: string;

    get id(): ID {
        return this._id;
    }

    set id(value: ID) {
        this._id = value;
    }

    public get author(): string {
        return this._author;
    }

    public get title(): string {
        return this._title;
    }

    public get body(): string {
        return this._body;
    }

    public set author(value: string) {
        this._author = value;
    }

    public set title(value: string) {
        this._title = value;
    }

    public set body(value: string) {
        this._body = value;
    }

    public toJSON(): JSONSerializableKeys<Post> {
        return {
            id: this.id,
            author: this.author,
            title: this.title,
            body: this.body
        };
    }
}
