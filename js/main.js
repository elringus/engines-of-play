
$(document).ready(function() {
    for (let i = 1; i <= 4; i++) {
        new Grid(PLAY_ENGINE.NOVELTY, $(`#novely-grid-${i}`), i);
        new Grid(PLAY_ENGINE.CHALLENGE, $(`#challenge-grid-${i}`), i);
        new Grid(PLAY_ENGINE.HARMONY, $(`#harmony-grid-${i}`), i);
        new Grid(PLAY_ENGINE.STIMULATION, $(`#stimulation-grid-${i}`), i);
    }
});

const PLAY_ENGINE = {
    NOVELTY: "novelty",
    CHALLENGE: "challenge",
    HARMONY: "harmony",
    STIMULATION: "stimulation"
};

class Grid {
    constructor(playEngine, container, quadrant) {
        this._nodes = new Array(3);
        for (let i = 0; i < 3; i++) {
            this._nodes[i] = new Array(3);
        }
        this._gridHtml = $('#grid-template').clone().removeAttr('id').addClass(playEngine);
        this._gridHtml.children().each((rowIndex, child) => {
            for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
                let quadrantColIndex = columnIndex;
                let quadrantRowIndex = rowIndex;
                if (quadrant == 1)
                    quadrantRowIndex = 2 - rowIndex;
                if (quadrant == 2) {
                    quadrantColIndex = 2 - columnIndex;
                    quadrantRowIndex = 2 - rowIndex;
                }
                if (quadrant == 3)
                    quadrantColIndex = 2 - columnIndex;
                this._nodes[quadrantColIndex][quadrantRowIndex] =
                    new GridNode($(child), this, quadrantColIndex, quadrantRowIndex);
            }
        });
        container.append(this._gridHtml);
    }

    onNodeHover(gridNode, isHovered) {
        this._unhoverAllNodes();
        if (isHovered) {
            for (let columnIndex = 0; columnIndex <= gridNode.columnIndex; columnIndex++) {
                for (let rowIndex = 0; rowIndex <= gridNode.rowIndex; rowIndex++) {
                    this._nodes[columnIndex][rowIndex].setIsHovered(true);
                }
            }
        }
    }

    onNodeClicked(gridNode) {
        let shouldUnselectOnlyNode = gridNode.columnIndex == 0 && gridNode.rowIndex == 0 && this._isOnlyOneNodeSelected();
        if (shouldUnselectOnlyNode) {
            gridNode.unselect();
            return;
        }
        this._unselectAllNodes();
        for (let columnIndex = 0; columnIndex <= gridNode.columnIndex; columnIndex++) {
            for (let rowIndex = 0; rowIndex <= gridNode.rowIndex; rowIndex++) {
                this._nodes[columnIndex][rowIndex].toggleSelected();

            }
        }
    }

    _unhoverAllNodes() {
        this._nodes.forEach(nodeArray => nodeArray.forEach(node => node.setIsHovered(false)));
    }

    _isOnlyOneNodeSelected () {
        let isItSo = this._nodes[0][0].isSelected;
        if (!isItSo) return false;
        this._nodes.forEach(nodeArray => nodeArray.forEach(node =>  {
            if ((node.columnIndex > 0 || node.rowIndex > 0) && node.isSelected)
                isItSo = false;
        }));
        return isItSo;
    }

    _unselectAllNodes() {
        this._nodes.forEach(nodeArray => nodeArray.forEach(node => node.unselect()));
    }
}

class GridNode {
    constructor(container, masterGrid, columnIndex, rowIndex) {
        this._nodeHtml = $('#node-template').clone().removeAttr('id');
        this._contentHtml = this._nodeHtml.children();
        //$(`<p>col:${columnIndex} row:${rowIndex}</p>`).appendTo(this._contentHtml);
        this._masterGrid = masterGrid;
        this._columnIndex = columnIndex;
        this._rowIndex = rowIndex;
        this._nodeHtml.mouseenter(() => this._masterGrid.onNodeHover(this, true));
        this._nodeHtml.mouseleave(() => this._masterGrid.onNodeHover(this, false));
        this._nodeHtml.click(() => this._masterGrid.onNodeClicked(this));
        container.append(this._nodeHtml);
    }

    toggleSelected() {
        this._contentHtml.toggleClass('grid-node-selected');
    }

    unselect() {
        this._contentHtml.removeClass('grid-node-selected');
    }

    setIsHovered(isHovered) {
        if (isHovered) this._contentHtml.addClass('grid-node-overhovered');
        else this._contentHtml.removeClass('grid-node-overhovered');
    }

    get columnIndex() {
        return this._columnIndex;
    }

    get rowIndex() {
        return this._rowIndex;
    }

    get isSelected () {
        return this._contentHtml.hasClass('grid-node-selected');
    }
}

