function CustomerModel() {
  this.CustomerId = ko.observable();
  this.CreatedDate = ko.observable(); 
  this.FirstName = ko.observable();
  this.LastName = ko.observable();
  this.Address1 = ko.observable();
  this.Address2 = ko.observable();
  this.City = ko.observable();
  this.State = ko.observable();
  this.Zip = ko.observable();
}

function AccountModel() {
  this.AccountId = ko.observable();
  this.CustomerId = ko.observable();
  this.CreatedDate = ko.observable();
  this.AccountNumber = ko.observable();
  this.Balance = ko.observable();
}

function TransactionModel() {
  this.TransactionId = ko.observable();
  this.AccountId = ko.observable();
  this.TransactionDate = ko.observable();
  this.Amount = ko.observable();
}

function ViewModel(){  var self = this;
  
  // page management
  self.page = ko.observable('customer.grid');
  
  // customer.detail
  self.selectedCustomer = new CustomerModel();
  self.selectedCustomerAccounts = ko.observableArray();
  self.saveCustomer = function() {
    if(self.page() == 'customer.add') {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:55514/api/customers',
        contentType: 'application/json;charset=utf-8',
        data: ko.mapping.toJSON(self.selectedCustomer),
        success: function(data) {
          alert('added');
          
          self.page('customer.grid');
        }
      });
    } else {
      $.ajax({
        type: 'PUT',
        url: 'http://localhost:55514/api/customers?id=' + self.selectedCustomer.CustomerId(),
        contentType: 'application/json;charset=utf-8',
        data: ko.mapping.toJSON(self.selectedCustomer),
        success: function(data) {
          alert('save successful');
          
          self.page('customer.grid');
        }
      }); 
    }
  };
  
  // customer.grid
  self.customers = ko.observableArray();
  self.addCustomer = function() {
    self.page('customer.add');  
  };
  self.editCustomer = function(customer) {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:55514/api/customers/' + customer.CustomerId(),
      success: function(data) {
        ko.mapping.fromJS(data, {}, self.selectedCustomer);
        
        $.ajax({
          type: 'GET',
          url: 'http://localhost:55514/api/customers/' + customer.CustomerId() + '/accounts',
          success: function(data) {
            ko.mapping.fromJS(data, {}, self.selectedCustomerAccounts);
            
            self.page('customer.detail');
          }
        });
      }
    });
  };
  self.deleteCustomer = function(customer) {
    if(confirm("Are you sure you wish to delete this customer?")) {
      $.ajax({
        type: 'DELETE',
        url: 'http://localhost:55514/api/customers?id=' + customer.CustomerId(),
        success: function(data) {
          alert('deleted');
        }
      })
    } 
  };
  
  $.ajax({
    type: 'GET',
    url: 'http://localhost:55514/api/customers',
    success: function(data) {
      ko.mapping.fromJS(data, {}, self.customers);
    }
  });

  function renderProductsPage(data){

    var page = $('.all-products'),
      allProducts = $('.all-products .products-list > li');

    // Hide all the products in the products list.
    allProducts.addClass('hidden');

    // Iterate over all of the products.
    // If their ID is somewhere in the data object remove the hidden class to reveal them.
    allProducts.each(function () {

      var that = $(this);

      data.forEach(function (item) {
        if(that.data('index') == item.id){
          that.removeClass('hidden');
        }
      });
    });

    // Show the page itself.
    // (the render function hides all pages so we need to show the one we want).
    page.addClass('visible');
}

ko.applyBindings(new ViewModel());