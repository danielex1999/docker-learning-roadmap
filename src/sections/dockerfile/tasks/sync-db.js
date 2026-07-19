let times = 0;

const syncDB = () => {
    times++;
    console.log('Tick cada múltiplo de 5 seg:', times);

    return times;
};

export default syncDB;