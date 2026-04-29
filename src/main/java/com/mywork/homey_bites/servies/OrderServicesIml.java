    package com.mywork.homey_bites.servies;


    import com.mywork.homey_bites.entity.OrderEntity;
    import com.mywork.homey_bites.io.OrderRequest;
    import com.mywork.homey_bites.io.OrderResponse;
    import com.mywork.homey_bites.repository.CartRepository;
    import com.mywork.homey_bites.repository.OrderRepository;
    import com.razorpay.Order;
    import com.razorpay.RazorpayClient;
    import com.razorpay.RazorpayException;
    import lombok.AllArgsConstructor;
    import lombok.NoArgsConstructor;
    import netscape.javascript.JSObject;
    import org.json.JSONObject;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.stereotype.Service;

    import java.util.List;
    import java.util.Map;
    import java.util.stream.Collectors;

    @Service

    public class OrderServicesIml implements OrderServices {

        @Autowired
        private OrderRepository orderRepository;
        @Autowired
        private  UserServices  userServices;

        @Autowired
        private CartRepository cartRepository;


        @Value("${razorpay_key}")
        private String RAZORPAY_KEY;

        @Value("${razorpay_secret}")
        private String RAZORPAY_SECRET;
        @Override
        public OrderResponse createdOrderWithPayment(OrderRequest request) throws RazorpayException {

            OrderEntity newOrder = convertToEntity(request);



                    //create the razorpay payment order
            RazorpayClient razorpayClient=new RazorpayClient(RAZORPAY_KEY,RAZORPAY_SECRET);
            JSONObject orderRequest=new JSONObject();
            orderRequest.put("amount",newOrder.getAmount()*100);
            orderRequest.put("currency","INR");
            orderRequest.put("payment_capture",1);

            Order razorpayOrder=razorpayClient.orders.create(orderRequest);
                newOrder.setRazorpayOrderId(razorpayOrder.get("id"));
                String loggedInUserId=userServices.findByUserId();
                newOrder.setUserId(loggedInUserId);
                orderRepository.save(newOrder);
                return convertToResponse(newOrder);

        }

        @Override
        public void verfiyPayment(Map<String, String> paymentData, String Status) {

            String razorPayOrderId = paymentData.get("razorpayOrderId");

            OrderEntity existingOrder=orderRepository.findByRazorpayOrderId(razorPayOrderId).orElseThrow(()->new RuntimeException("order not found"));
                    //existingOrder.setPaymentStatus(paymentData.get("payment_status"));
                    existingOrder.setOrderStatus(Status);
                    existingOrder.setRazorpaySignature(paymentData.get("razorpay_signature"));
                   existingOrder.setRazorpayPaymentId(paymentData.get("razorpay_payment_id"));
                   orderRepository.save(existingOrder);

                   if("Paid".equals(Status)){
                       cartRepository.deleteByUserId(existingOrder.getUserId());
            }
        }

        @Override
        public List<OrderResponse> getUserOrders() {
            String loggedInUserId=userServices.findByUserId();
            List<OrderEntity> list=orderRepository.findByUserId(loggedInUserId);
                return  list.stream().map(entity->convertToResponse(entity)).collect(Collectors.toList());
        }

        @Override
        public void removeOrder(String orderId) {
            orderRepository.deleteById(orderId);

        }

        @Override
        public List<OrderResponse> getOrdersAllUser() {
            List<OrderEntity> list=orderRepository.findAll();
            return  list.stream().map(entity->convertToResponse(entity)).collect(Collectors.toList());
        }

        @Override
        public void updateOrderStatus(String orderId, String status) {
            OrderEntity entity=orderRepository.findById(orderId).orElseThrow(()->new RuntimeException("order not found"));
            entity.setOrderStatus(status);
            orderRepository.save(entity);

        }

        private OrderResponse convertToResponse(OrderEntity newOrder) {
           return OrderResponse.builder()
                    .id(newOrder.getId())
                    .amount(newOrder.getAmount())
                    .userAddress(newOrder.getUserAddress())
                    .userId(newOrder.getUserId())
                    .razorpayOrderId(newOrder.getRazorpayOrderId())
                    .PaymentStatus(newOrder.getPaymentStatus())
                    .orderStatus(newOrder.getOrderStatus())
                   .userPhone(newOrder.getUserPhone())
                   .userEmail(newOrder.getUserEmail())
                   .orderItems(newOrder.getOrderItems())

                    .build();
        }


        private OrderEntity convertToEntity(OrderRequest Request) {
          return   OrderEntity.builder()
                    .userAddress(Request.getUserAddress())
                    .amount(Request.getAmount())
                    .orderItems(Request.getOrderItems())
                  .userEmail(Request.getEmail())
                  .userPhone(Request.getPhoneNumber())
                  .orderStatus(Request.getOrderStatus())
                    .build();
        }
    }
