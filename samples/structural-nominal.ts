interface Customer {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  // price: number
}

function getCustomerName(customer: Customer): string {
  return customer.name
}

const customer: Customer = { id: '1', name: 'John Smith' }
const product: Product = {id: '123-1', name: 'Book' }

getCustomerName(customer) // returns 'John Smith'
getCustomerName(product) // OK, returns 'Book' as the two types are assignable

//------------------------------------------------------------------------------

class Order {
    id: string = ''
    date: Date = new Date()
    // isComplete: boolean = false
}

class Payment {
    id: string = ''
    date: Date = new Date()
    // amount: number = 0
}

function getPaymentDate(payment: Payment): Date {
    return payment.date
}

const payment = new Payment()
const order = new Order()
getPaymentDate(payment)
getPaymentDate(order)