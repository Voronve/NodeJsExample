import Order from '../models/ServiceOrders';

exports.getOrderList = async (req, res) =>{
  try{
    Order.find()
    .then(allOrders =>{
      if(!allOrders.length){
        res.status(200).send('Замовлень не знайдено');
        return;
      }
      res.status(200).send(allOrders);
    })
    .catch(err =>{
      console.log(err);
      res.status(500).send('Oops...Some interesting situation has occured...');
    });
  }catch(err){
    res.sendStatus(500);
  }
}