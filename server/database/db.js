import { connect } from 'mongoose';

const connectToMongo = async () => {
  try {
    await connect(
      'mongodb://kundusubhajit75:NyUJzgvT5cqLk3dN@ac-i0kbnim-shard-00-00.xkcgmrb.mongodb.net:27017,ac-i0kbnim-shard-00-01.xkcgmrb.mongodb.net:27017,ac-i0kbnim-shard-00-02.xkcgmrb.mongodb.net:27017/rzp-test?ssl=true&replicaSet=atlas-5g0rk9-shard-0&authSource=admin&retryWrites=true&w=majority'
    );
    console.log('---***Database Connected Successfully***---');
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;
