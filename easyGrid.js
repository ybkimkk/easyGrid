let treeGridEDPath = "../js/treegrid/GridED.js"
let treeGridEPath = "../js/treegrid/GridE.js"

// let treeGridEDPath = "/sys/js/treegrid/GridED.js"
// let treeGridEPath = "/sys/js/treegrid/GridE.js"


document.write(`<script src=${treeGridEDPath}></script>`);
document.write(`<script src=${treeGridEPath}></script>`);

/**
 * @desc easy to use treeGrid.js framework at javascript
 * @author 김영빈
 * @version 1.0
 */
class easyGrid {
    #domId;
    #url;
    #fullUrl;
    #requestParam;
    #layout;
    #uploadUrl;
    #uploadData;
    #uploadFormat;
    #uploadFlags;
    #exportData;
    #exportUrl;
    #grid;
    #gridId;

    /**
     * @desc init and create table
     * @param {string} domId - dom id
     * @param {string} url - request url
     * @param {string} layout - layout file
     * @param {{}} requestParam -  request param
     * @param uploadData
     * @param uploadFormat
     * @param uploadUrl
     * @param uploadFlags
     * @param exportData
     * @param exportUrl
     */
    constructor(domId, url, layout, requestParam = {}, uploadUrl = "", uploadData = "", uploadFormat = "", uploadFlags = "", exportData = "", exportUrl = "") {
        this.#domId = domId;
        this.#url = url;
        this.#fullUrl = url;

        this.#fullUrl += this.#editGetMethodParam(requestParam);
        this.#requestParam = requestParam
        this.#layout = layout;

        this.#uploadUrl = uploadUrl
        this.#uploadData = uploadData
        this.#uploadFormat = uploadFormat
        this.#uploadUrl = uploadUrl
        this.#uploadFlags = uploadFlags
        this.#exportData = exportData
        this.#exportUrl = exportUrl

        this.#grid = TreeGrid({
            Debug: [""],
            Data: {
                Url: this.#fullUrl
            },
            Layout: {
                Url: this.#layout
            },
            Upload: {
                Url: this.#uploadUrl,
                Data: this.#uploadData,
                Format: this.#uploadFormat,
                Flag: this.#uploadFlags,
            },
            Export: {
                Url: this.#exportUrl,
                Data: this.#exportData,
            },
            id: this.#domId
        }, this.#domId);
        this.#gridId = this.#grid.id
    }

    /**
     * @desc reload grid body
     */
    reload() {
        this.#grid.ReloadBody();
    }


    getGridSource() {
        return this.#grid.Source;
    }

    /**
     * @desc get grid field, including hiding field(Visible "1" or "0")
     * @return {string[]}
     */

    getGridColNames() {
        let cols = this.#grid.GetCols();
        let colName = [];
        for (let colsKey in cols) {
            if (cols[colsKey] !== "Panel" && cols[colsKey] !== "_ConstWidth") {
                colName.push(cols[colsKey])
            }
        }
        return colName
    }

    /**
     * @desc get Current Value
     * @param {object} row - grid row
     * @param {string} col - grid col
     * @return {string}
     */
    getGridValue(row, col) {
        return this.#grid.GetString(row, col)
    }

    getGridData() {
        return new Promise((resolve, reject) => {
            Grids.OnReady = (grid) => {
                const result = [];
                for (let row = grid.GetFirst(); row; row = grid.GetNext(row)) {
                    const rowData = {};
                    const keys = Object.keys(row);
                    keys.forEach(key => {
                        rowData[key] = row[key];
                    });
                    result.push(rowData);
                }
                resolve(result);
            }
            this.reload();
            const grid = this.getGrid();
            if (!grid) {
                reject(new Error("Grid not found"));
            }
        });
    }

    getMountedGridData() {
        const result = [];
        for (let row = Grids[this.#gridId].GetFirst(); row; row = Grids[this.#gridId].GetNext(row)) {
            const rowData = {};
            const keys = Object.keys(row);
            keys.forEach(key => {
                if (typeof  row[key] === 'object') {
                    return;
                }
                rowData[key] = row[key];
            });
            result.push(rowData)
        }

        return result;
    }

    getChangeGridData() {
        const result = [];
        let data = this.getMountedGridData();
        data.forEach(x => {
            if ((x.hasOwnProperty('Changed') && x['Changed'] === 1)||(x.hasOwnProperty('Deleted') && x['Deleted'] === true)) {
                result.push(x)
            }
        })
        return result;
    }


    /**
     * @desc get Current Row Value
     * @param {object} row - grid row
     * @return {{}}
     */
    getGridRowValue(row) {
        let json = {};
        let gridColNames = this.getGridColNames();
        gridColNames.forEach((v, k) => {
            json[v] = row[v]
        })

        return json;
    }

    clear() {
        this.#grid.Clear();
    }


    /**
     * @desc request data
     * @method get
     * @param {string} url - request url
     * @param {{}} requestParam - request data
     * @param {{}} method - request method  [GET OR POST]
     */
    request(url, requestParam = {}, method = 'GET') {
        this.#url = url;
        this.#requestParam = requestParam;
        this.#fullUrl = url + this.#editGetMethodParam(requestParam);
        this.getGridSource().Data.Url = this.#fullUrl;
        this.getGridSource().Data.Method = method;
        this.reload();
    }

    /**
     * @desc edit get method param
     * @param {{}} requestParam - get url param
     */

    #editGetMethodParam(requestParam) {
        if (!requestParam || typeof requestParam !== 'object') {
            throw new Error('questParam은 객체 또는 유효한 URLSearchParams 이어야 합니다.');
        }
        const params = new URLSearchParams(requestParam).toString();
        return "?" + params;
    }


    getUrl() {
        return this.#url;
    }

    getFullUrl() {
        return this.#fullUrl;
    }

    getRequestParam() {
        return this.#requestParam;
    }

    getLayout() {
        return this.#layout;
    }

    getGrid() {
        return this.#grid;
    }

    getGridId() {
        return this.#gridId;
    }

    /**
     * @param {string} url
     */
    setUrl(url) {
        this.#url = url;
        this.#fullUrl = url + this.#editGetMethodParam(this.#requestParam);
        this.getGridSource().Data.Url = url;
    }

    /**
     * @param {{}} param
     */
    setRequestParam(param) {
        this.#requestParam = param;
        this.#fullUrl = this.#url + this.#editGetMethodParam(this.#requestParam);
    }

    addRow(isLast = true) {
        if (isLast) {
            Grids[this.#gridId].AddRow(null, null, true);
        } else {
            Grids[this.#gridId].AddRow(null, Grids[this.#gridId].GetFirst(), true);
        }


    }
}
