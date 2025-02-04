
/**
 * Plots a 2d matrix on a canvas.
 *
 * @param {array} matrix 2d array
 * @param {canvas} canvas to plot on
 *
 * @return {void} void
 */
function Plot2dMatrix(matrix, canvas) {
    const ctx = canvas.getContext('2d');

    const sizeX = canvas.width / matrix.length;
    const sizeY = canvas.height / matrix[0].length;

    let y = 0;
    for (let i = 0; i < matrix.length; ++i) {
        let x = 0;

        for (let j = 0; j < matrix[0].length; ++j) {
            const color = matrix[i][j];
            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.fillRect(x, y, sizeX + x, sizeY + y);

            x += sizeX;
        }

        y += sizeY;
    }

    return;
}

/**
 * Creates a "light map" of a matrix (higher values are a lighter color).
 *
 * @param {array} matrix to create a light map of
 * @param {number} max value of the matrix
 * @param {number} min value of the matrix
 *
 * @return {array} lightMap of the matrix
 */
function LightMap(matrix, max ='', min ='') {
    if (max == '') max = Math.max(...matrix.flat());
    if (min == '') min = Math.min(...matrix.flat());
    const lightMap = [];
    for (let i = 0; i < matrix.length; ++i) {
        const temp = [];

        for (let j = 0; j < matrix.length; ++j) {
            temp[j] = 255 - Math.floor((matrix[i][j] - min) / (max - min) * 255);
        }

        lightMap.push(temp);
    }

    return lightMap;
}

/**
 * Displays feature maps on the website
 *
 * @param {object} features to be displayed
 * @param {number} rows to be displayed in
 *
 * @return {void} void
 */
export default function DisplayFM(features, rows = 2) {
    const parent = document.getElementById('featureMap');
    DeleteChildNodes(parent);

    const title = document.createElement('h2');
    title.id = 'fm-title';
    title.append('Feature Maps');

    parent.append(title);

    const FM = [];
    for (let i = 0; i < features.length; ++i) {
        FM.push(features[i].flat());
    }
    const max = Math.max(...FM.flat());
    const min = Math.min(...FM.flat());
    const rowLength = Math.ceil(features.length / rows);
    let remaining = features.length;

    for (let i = 0; i < features.length; i += rowLength) {
        const row = document.createElement('div');
        row.className = 'FM-row';
        row.style.height = 100 / rows + '%';

        const dimension = Math.min(parent.clientWidth / (rowLength + 1), parent.clientHeight / (rows + 1));
        const canvasWidth = 100 * dimension / parent.clientWidth + '%';
        const canvasHeight = 100 * dimension / parent.clientHeight * rows + '%';

        for (let j = 0; j < rowLength; ++j) {
            if (remaining--) {
                let canvas = document.createElement('canvas');
                Plot2dMatrix(LightMap(features[i+j], max, min), canvas);

                // evt. give each FM a name
                canvas = row.appendChild(canvas);
                canvas.style.width = canvasWidth;
                canvas.style.height = canvasHeight;
            }
        }

        parent.appendChild(row);
    }

    return;
}

/**
 * Deletes all child nodes of a parent node
 *
 * @param {object} parent
 *
 * @return {void} void
 */
function DeleteChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    return;
}
