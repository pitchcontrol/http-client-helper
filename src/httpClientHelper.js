import EventDispatcher from '@vaalentin/event-dispatcher'

export class HttpClient extends EventDispatcher {
    constructor(baseUrl, options = {}) {
        super();
        this._baseUrl = baseUrl;
        this._options = Object.assign({
            credentials: 'include',
            headers: {},
            defaultMessages: {
                error: {title: 'Error!', message: 'An error has occurred.'},
                success: {title: 'Success!', message: 'An operation has been successfully.'}
            }
        }, options);
        this._activeRequests = new Set();
    }

    _isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    _attachEvents(url, promise, defaultMessages) {
        promise.then(response => {
            if (response.ok) {
                this.dispatchEvent('success', defaultMessages ? defaultMessages.success : undefined, response);
            } else {
                this.dispatchEvent('error', defaultMessages ? defaultMessages.error : undefined, response);
            }
            this._removeActiveRequest(url);
        }, error => {
            this.dispatchEvent('error', defaultMessages ? defaultMessages.error : undefined, error);
            this._removeActiveRequest(url);
        });

        this._addActiveRequest(url);
        return promise;
    }

    _addActiveRequest(url) {
        const before = this._activeRequests.size;
        this._activeRequests.add(url);
        if (before === 0) {
            this.dispatchEvent('busy', true);
        }
    }

    _removeActiveRequest(url) {
        const before = this._activeRequests.size;
        this._activeRequests.delete(url);
        if (before !== 0 && this._activeRequests.size === 0) {
            this.dispatchEvent('busy', false);
        }
    }

    _urlPrepare(url, params) {
        let str = this._baseUrl.replace(/\/$/, "") + '/' + url.replace(/^\//, "");
        if (params) {
            str = str + '?' + encodeURIComponent(Object.keys(params).map(i => i + '=' + params[i]).join('&'));
        }
        return str;
    }

    get activeRequests() {
        return this._activeRequests.size;
    }

    get(url, params, options) {
        url = this._urlPrepare(url, params);
        let defaultMessages = options !== undefined && options.messages !== undefined ? options.messages : this._options.defaultMessages;
        let promise = fetch(url, options || this._options);

        return this._attachEvents(url, promise, defaultMessages);
    }

    post(url, params, options) {
        url = this._urlPrepare(url);

        let opt = options || this._options;
        if (!opt.headers['Content-Type'])
            opt.headers['Content-Type'] = 'application/json';
        opt.body = JSON.stringify(params);
        opt.method = 'POST';
        let promise = fetch(url, opt);
        let defaultMessages = options && options.messages ? options.messages : this._options.defaultMessages;
        return this._attachEvents(url, promise, defaultMessages);
    }

    postForm(url, params, options) {
        url = this._urlPrepare(url, params);
        let opt = options || this._options;

        opt.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        opt.method = 'POST';
        let promise = fetch(url, opt);

        let defaultMessages = options && options.messages ? options.messages : this._options.defaultMessages;
        return this._attachEvents(url, promise, defaultMessages);
    }

    put(url, params, options) {
        url = this._urlPrepare(url);

        let opt = options || this._options;
        if (!opt.headers['Content-Type'])
            opt.headers['Content-Type'] = 'application/json';
        opt.body = JSON.stringify(params);
        opt.method = 'PUT';

        let promise = fetch(url, opt);

        let defaultMessages = options && options.messages ? options.messages : this._options.defaultMessages;
        return this._attachEvents(url, promise, defaultMessages);
    }

    patch(url, params, options) {
        url = this._urlPrepare(url);

        let opt = options || this._options;
        if (!opt.headers['Content-Type'])
            opt.headers['Content-Type'] = 'application/json';
        opt.body = JSON.stringify(params);
        opt.method = 'PATCH';

        let promise = fetch(url, opt);

        let defaultMessages = options && options.messages ? options.messages : this._options.defaultMessages;
        return this._attachEvents(url, promise, defaultMessages);
    }
}