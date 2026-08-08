export class RequestStateManager {
    constructor(requestFn, options = {}) {
        this.requestFn = requestFn
        this.loading = false
        this.data = options.defaultData ?? null
        this.error = null

        this.debounceTime = options.debounceTime ?? 300
        this.onlyLatest = options.onlyLatest ?? true
        this.dedupe = options.dedupe ?? true

        this.timer = null
        this.requestId = 0
        this.pendingMap = new Map()
    }

    getCacheKey(args) {
        return JSON.stringify(args)
    }

    async run(...args) {
        const currentId = ++this.requestId
        const cacheKey = this.getCacheKey(args)

        if (this.dedupe && this.pendingMap.has(cacheKey)) {
            return this.pendingMap.get(cacheKey)
        }

        this.loading = true
        this.error = null

        const requestPromise = this.requestFn(...args).then((res) => {
                if (!this.onlyLatest || currentId === this.requestId) {
                    this.data = res
                }
                return res
            }).catch((err) => {
                if (!this.onlyLatest || currentId === this.requestId) {
                    this.error = err
                }
                throw err
            }).finally(() => {
                this.pendingMap.delete(cacheKey)

                if (!this.onlyLatest || currentId === this.requestId) {
                    this.loading = false
                }
            })
        this.pendingMap.set(cacheKey, requestPromise)
        return requestPromise
    }

    debounceRun(...args) {
        clearTimeout(this.timer)
        return new Promise((resolve, reject) => {
            this.timer = setTimeout(() => {
                this.run(...args).then(resolve).catch(reject)
            }, this.debounceTime)
        })
    }

    reset() {
        this.loading = false
        this.data = null
        this.error = null
        this.requestId += 1
        clearTimeout(this.timer)
        this.pendingMap.clear()
    }
}
