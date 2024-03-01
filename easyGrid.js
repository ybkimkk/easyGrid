let treeGridEDPath = "../js/treegrid/GridED.js"
let treeGridEPath = "../js/treegrid/GridE.js"


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
    #grid;
    #gridId;

    /**
     * @desc init and create table
     * @param {string} domId - dom id
     * @param {string} url - request url
     * @param {string} layout - layout file
     * @param {{}} requestParam -  request param
     */
    constructor(domId, url, layout, requestParam = {}) {
        this.#domId = domId;
        this.#url = url;
        this.#fullUrl = url;
        this.#fullUrl += this.#editGetMethodParam(requestParam);
        this.#requestParam = requestParam
        this.#layout = layout;
        this.#grid = TreeGrid({
            Data: {
                Url: this.#fullUrl
            },
            Layout: {
                Url: this.#layout
            },
            Sync: 1
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
        console.log(this.#grid.GetCols("Visible"));
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
     */
    request(url, requestParam = {},) {
        this.#url = url;
        this.#requestParam = requestParam;
        this.#fullUrl = url + this.#editGetMethodParam(requestParam);
        this.getGridSource().Data.Url = this.#fullUrl;
        this.reload();
    }

    /**
     * @desc edit get method param
     * @param {{}} requestParam - get url param
     */

    #editGetMethodParam(requestParam) {
        let paramUrl = '';
        for (let paramKey in requestParam) {
            paramUrl += `&${paramKey}=${requestParam[paramKey]}`;
        }
        if (paramUrl.length === 0) {
            return ""
        }
        return "?" + paramUrl.slice(1);
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
}
