let containerHtml;

$(document).ready(function() {
    containerHtml = $('#page-content');

    new Grid();
});

const PLAY_ENGINE = {
    NOVELTY: 0,
    CHALLENGE: 1,
    HARMONY: 2,
    STIMULATION: 3
};

class Grid {
    constructor() {
        for (let i = 0; i < 10; i++) {
            new GridNode(this, i, i);
        }
    }

    onNodeHover(gridNode, isHovered) {
        gridNode.setIsHovered(isHovered);
    }

    onNodeClicked(gridNode) {
        gridNode.toggleSelected();
    }
}

class GridNode {
    constructor(masterGrid, x, y) {
        this._nodeHtml = $('#node-template').clone().removeAttr('id');
        this._contentHtml = this._nodeHtml.children();
        this._masterGrid = masterGrid;
        this._x = x;
        this._y = y;
        this._nodeHtml.mouseenter(() => this._masterGrid.onNodeHover(this, true));
        this._nodeHtml.mouseleave(() => this._masterGrid.onNodeHover(this, false));
        this._nodeHtml.click(() => this._masterGrid.onNodeClicked(this));
        containerHtml.append(this._nodeHtml);
    }

    toggleSelected() {
        this._contentHtml.toggleClass('grid-node-selected');
    }

    setIsHovered(isHovered) {
        if (isHovered) this._contentHtml.addClass('grid-node-overhovered');
        else this._contentHtml.removeClass('grid-node-overhovered');
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}

