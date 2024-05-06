import {Shape} from "../type/Shape.ts";

export class Memento {
    private shapes: Shape[];

    constructor(shapes: Shape[]) {
        this.shapes = shapes.slice(); // Create a copy to avoid mutation
    }
}