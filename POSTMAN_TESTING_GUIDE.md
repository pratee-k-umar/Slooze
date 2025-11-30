# Postman Testing Guide - Slooze.xyz API

Complete guide for testing the Slooze.xyz Food Ordering API with example data.

## Setup

1. **Import the Postman Collection**
   - Import `postman_collection.json` from the project root
   - The collection includes all endpoints with pre-configured requests

2. **Set Environment Variables**
   - Create a new environment in Postman
   - Add variable: `base_url` = `http://localhost:3000` (or your deployed URL)
   - The `access_token` will be set automatically after login

## Testing Flow

### 1. Authentication

#### Login as Admin (Full Access)
```
POST {{base_url}}/auth/login

Body (JSON):
{
  "email": "nick.fury@shield.com",
  "password": "password123"
}

Expected Response:
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "nick.fury@shield.com",
      "name": "Nick Fury",
      "role": "admin",
      "country": null
    }
  }
}
```

#### Login as Manager (India)
```
POST {{base_url}}/auth/login

Body (JSON):
{
  "email": "captain.marvel@india.com",
  "password": "password123"
}
```

#### Login as Member (India)
```
POST {{base_url}}/auth/login

Body (JSON):
{
  "email": "thanos@india.com",
  "password": "password123"
}
```

**Note:** After login, the `access_token` is automatically saved to the environment variable by the test script.

---

### 2. Restaurants

#### Get All Restaurants (Country-Scoped)
```
GET {{base_url}}/restaurants

Headers:
Authorization: Bearer {{access_token}}

Expected Response (for India Manager):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Taj Mahal Restaurant",
      "description": "Authentic Indian cuisine with royal flavors",
      "address": "Colaba, Mumbai, Maharashtra",
      "country": "India",
      "isActive": true,
      "createdAt": "2024-11-29T00:00:00.000Z",
      "updatedAt": "2024-11-29T00:00:00.000Z"
    },
    // ... only India restaurants
  ]
}
```

#### Get Restaurant by ID
```
GET {{base_url}}/restaurants/{restaurant-id}

Headers:
Authorization: Bearer {{access_token}}

Example:
GET {{base_url}}/restaurants/550e8400-e29b-41d4-a716-446655440000
```

#### Create Restaurant (Admin/Manager Only)
```
POST {{base_url}}/restaurants

Headers:
Authorization: Bearer {{access_token}}

Body (JSON):
{
  "name": "Spice Paradise",
  "description": "Authentic Kerala cuisine",
  "address": "MG Road, Kochi, Kerala",
  "country": "India"
}

Expected Response:
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "name": "Spice Paradise",
    "description": "Authentic Kerala cuisine",
    "address": "MG Road, Kochi, Kerala",
    "country": "India",
    "isActive": true,
    "createdAt": "2024-11-29T00:00:00.000Z",
    "updatedAt": "2024-11-29T00:00:00.000Z"
  },
  "message": "Restaurant created successfully"
}
```

#### Update Restaurant (Admin/Manager Only)
```
PATCH {{base_url}}/restaurants/{restaurant-id}

Headers:
Authorization: Bearer {{access_token}}

Body (JSON):
{
  "description": "Updated description - Best Kerala food in town",
  "isActive": true
}
```

#### Delete Restaurant (Admin Only)
```
DELETE {{base_url}}/restaurants/{restaurant-id}

Headers:
Authorization: Bearer {{access_token}}

Expected Response:
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

---

### 3. Menu Items

#### Get All Menu Items (Country-Scoped)
```
GET {{base_url}}/menu-items

Headers:
Authorization: Bearer {{access_token}}

Expected Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "restaurantId": "restaurant-uuid",
      "name": "Butter Chicken",
      "description": "Creamy tomato curry with tender chicken",
      "price": 15.99,
      "category": "main",
      "isAvailable": true,
      "createdAt": "2024-11-29T00:00:00.000Z",
      "updatedAt": "2024-11-29T00:00:00.000Z"
    }
  ]
}
```

#### Get Menu Items by Restaurant
```
GET {{base_url}}/menu-items/restaurant/{restaurant-id}

Headers:
Authorization: Bearer {{access_token}}

Example:
GET {{base_url}}/menu-items/restaurant/550e8400-e29b-41d4-a716-446655440000
```

#### Create Menu Item (Admin/Manager Only)
```
POST {{base_url}}/menu-items

Headers:
Authorization: Bearer {{access_token}}

Body (JSON):
{
  "restaurantId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Paneer Tikka Masala",
  "description": "Grilled cottage cheese in spicy gravy",
  "price": 13.99,
  "category": "main",
  "isAvailable": true
}

Categories: "appetizer", "main", "dessert", "beverage"
```

#### Update Menu Item (Admin/Manager Only)
```
PATCH {{base_url}}/menu-items/{menu-item-id}

Headers:
Authorization: Bearer {{access_token}}

Body (JSON):
{
  "price": 14.99,
  "isAvailable": false
}
```

---

### 4. Orders (Complete Flow)

#### Step 1: Create Order
```
POST {{base_url}}/orders

Headers:
Authorization: Bearer {{access_token}}

Body (JSON):
{
  "restaurantId": "550e8400-e29b-41d4-a716-446655440000"
}

Expected Response:
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "restaurantId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "pending",
    "totalAmount": 0,
    "paymentStatus": "pending",
    "country": "India",
    "createdAt": "2024-11-29T00:00:00.000Z",
    "updatedAt": "2024-11-29T00:00:00.000Z"
  },
  "message": "Order created successfully"
}
```

**Save the order ID for next steps!**

#### Step 2: Add Items to Order
```
POST {{base_url}}/orders/{order-id}/items

Headers:
Authorization: Bearer {{access_token}}

Body (JSON):
{
  "menuItemId": "menu-item-uuid",
  "quantity": 2
}

Example:
POST {{base_url}}/orders/order-123/items
{
  "menuItemId": "item-456",
  "quantity": 2
}

Expected Response:
{
  "success": true,
  "data": {
    "id": "order-item-uuid",
    "orderId": "order-123",
    "menuItemId": "item-456",
    "quantity": 2,
    "price": 15.99,
    "subtotal": 31.98
  },
  "message": "Item added to order successfully"
}
```

**Add multiple items by calling this endpoint multiple times with different menuItemIds**

#### Step 3: Get Order Details
```
GET {{base_url}}/orders/{order-id}

Headers:
Authorization: Bearer {{access_token}}

Expected Response:
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "userId": "user-uuid",
    "restaurantId": "restaurant-uuid",
    "status": "pending",
    "totalAmount": 45.97,
    "paymentStatus": "pending",
    "country": "India",
    "orderItems": [
      {
        "id": "item-1",
        "quantity": 2,
        "price": 15.99,
        "subtotal": 31.98,
        "menuItem": {
          "name": "Butter Chicken"
        }
      },
      {
        "id": "item-2",
        "quantity": 1,
        "price": 13.99,
        "subtotal": 13.99,
        "menuItem": {
          "name": "Paneer Tikka"
        }
      }
    ],
    "restaurant": {
      "name": "Taj Mahal Restaurant"
    }
  }
}
```

#### Step 4: Checkout Order (Admin/Manager Only)
```
POST {{base_url}}/orders/{order-id}/checkout

Headers:
Authorization: Bearer {{access_token}}

Body (JSON):
{
  "paymentMethodId": "payment-method-uuid"
}

Example (using Credit Card):
{
  "paymentMethodId": "pm-credit-card-uuid"
}

Expected Response:
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "status": "confirmed",
    "paymentStatus": "paid",
    "totalAmount": 45.97,
    "paymentMethodId": "pm-credit-card-uuid"
  },
  "message": "Order checked out successfully"
}
```

#### Step 5: Cancel Order (Admin/Manager Only)
```
POST {{base_url}}/orders/{order-id}/cancel

Headers:
Authorization: Bearer {{access_token}}

Expected Response:
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "status": "cancelled"
  },
  "message": "Order cancelled successfully"
}
```

#### Get All Orders (Filtered by Role)
```
GET {{base_url}}/orders

Headers:
Authorization: Bearer {{access_token}}

Response varies by role:
- Admin: All orders
- Manager: Orders from their country
- Member: Only their own orders
```

---

### 5. Payment Methods

#### Get All Payment Methods
```
GET {{base_url}}/payment-methods

Headers:
Authorization: Bearer {{access_token}}

Expected Response:
{
  "success": true,
  "data": [
    {
      "id": "pm-1",
      "name": "Credit Card",
      "type": "credit_card",
      "isActive": true,
      "createdAt": "2024-11-29T00:00:00.000Z",
      "updatedAt": "2024-11-29T00:00:00.000Z"
    },
    {
      "id": "pm-2",
      "name": "Debit Card",
      "type": "debit_card",
      "isActive": true
    },
    {
      "id": "pm-3",
      "name": "UPI",
      "type": "upi",
      "isActive": true
    },
    {
      "id": "pm-4",
      "name": "Cash on Delivery",
      "type": "cash",
      "isActive": true
    }
  ]
}
```

#### Update Payment Method (Admin Only)
```
PATCH {{base_url}}/payment-methods/{payment-method-id}

Headers:
Authorization: Bearer {{access_token}}

Body (JSON):
{
  "isActive": false
}

Expected Response:
{
  "success": true,
  "data": {
    "id": "pm-1",
    "name": "Credit Card",
    "type": "credit_card",
    "isActive": false
  },
  "message": "Payment method updated successfully"
}
```

---

## Testing RBAC (Role-Based Access Control)

### Test 1: Member Cannot Checkout
```
1. Login as Member (thanos@india.com)
2. Create an order
3. Add items to order
4. Try to checkout

POST {{base_url}}/orders/{order-id}/checkout

Expected Response: 403 Forbidden
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "Members cannot checkout orders"
  }
}
```

### Test 2: Manager Cannot Update Payment Methods
```
1. Login as Manager (captain.marvel@india.com)
2. Try to update a payment method

PATCH {{base_url}}/payment-methods/{pm-id}

Expected Response: 403 Forbidden
```

### Test 3: Manager Cannot Access Other Country Data
```
1. Login as India Manager (captain.marvel@india.com)
2. Get all restaurants

GET {{base_url}}/restaurants

Expected: Only India restaurants returned
```

---

## Testing Country-Scoped Access

### Test 1: India Manager Sees Only India Data
```
1. Login: captain.marvel@india.com
2. GET /restaurants
   Result: Only India restaurants (Taj Mahal, Spice Garden, etc.)
3. GET /menu-items
   Result: Only menu items from India restaurants
4. GET /orders
   Result: Only orders from India restaurants
```

### Test 2: America Manager Sees Only America Data
```
1. Login: captain.america@usa.com
2. GET /restaurants
   Result: Only America restaurants (American Diner, Burger Haven, etc.)
```

### Test 3: Admin Sees All Data
```
1. Login: nick.fury@shield.com
2. GET /restaurants
   Result: All restaurants from both countries
```

---

## Complete Order Flow Example

### Scenario: Member Creates Order, Manager Checks Out

**Step 1: Member Creates Order**
```
Login: thanos@india.com
POST /orders
{
  "restaurantId": "taj-mahal-id"
}
```

**Step 2: Member Adds Items**
```
POST /orders/{order-id}/items
{
  "menuItemId": "butter-chicken-id",
  "quantity": 2
}

POST /orders/{order-id}/items
{
  "menuItemId": "naan-id",
  "quantity": 3
}
```

**Step 3: Manager Logs In and Checks Out**
```
Login: captain.marvel@india.com
GET /orders
(Find the pending order)

POST /orders/{order-id}/checkout
{
  "paymentMethodId": "credit-card-id"
}
```

---

## Error Responses

### 401 Unauthorized (No Token)
```
{
  "success": false,
  "error": {
    "statusCode": 401,
    "message": "Unauthorized"
  }
}
```

### 403 Forbidden (Insufficient Permissions)
```
{
  "success": false,
  "error": {
    "statusCode": 403,
    "message": "You do not have permission to access this resource"
  }
}
```

### 404 Not Found
```
{
  "success": false,
  "error": {
    "statusCode": 404,
    "message": "Restaurant not found"
  }
}
```

### 400 Bad Request (Validation Error)
```
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": [
      "email must be an email",
      "password should not be empty"
    ]
  }
}
```

---

## Quick Reference: Test User Credentials

| Email | Password | Role | Country |
|-------|----------|------|---------|
| nick.fury@shield.com | password123 | Admin | All |
| captain.marvel@india.com | password123 | Manager | India |
| captain.america@usa.com | password123 | Manager | America |
| thanos@india.com | password123 | Member | India |
| thor@india.com | password123 | Member | India |
| travis@usa.com | password123 | Member | America |

---

## Tips for Testing

1. **Always login first** - Copy the access_token from the response
2. **Use environment variables** - Set `{{base_url}}` and `{{access_token}}`
3. **Test with different roles** - Login as different users to see RBAC in action
4. **Save IDs** - Keep track of restaurant, menu item, and order IDs for testing
5. **Check country filtering** - Verify that India users only see India data
6. **Test error cases** - Try unauthorized actions to verify security

---

## Automated Testing with Postman

The collection includes test scripts that:
- Automatically save the access_token after login
- Validate response status codes
- Check response structure

Run the entire collection with the Collection Runner to test all endpoints automatically.
