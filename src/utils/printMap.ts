
/**
 * Receives a map<string | symbol, any> and prints it to the console.table with 
 * the keys as the first column and the values as the second column
 */
export const printMap = (map: Map<string | symbol, any>) => {
    const table = Array.from(map).map(([key, value]) => {
        return { key, value };
    });
    console.table(table);
}
