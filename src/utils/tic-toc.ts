

export function tictoc(msg = '') {
    const tic = {start: new Date().getTime(), msg}
    return {
        toc: (msg = '') => {
            const toc = new Date().getTime();
            const interval = toc - tic.start;
            console.log(`${interval / 1000.0}s ${tic.msg} ${msg}`);
            return interval
        }
    }
}