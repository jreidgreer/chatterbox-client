// YOUR CODE HERE:

var app = {
  messages: '',
  displayMessages: function() {
    $('#chats').empty();
    for (var i = 0; i < this.messages.length; i++) {
      var current = this.messages[i];
      var $container = $('<div class="container"></div>');
      var $name = $('<div class="name"></div>');
      var $message = $('<div class="name"></div>');
      $name.text(JSON.stringify(current.username));
      $container.append($name);
      $message.text(JSON.stringify(current.text));
      $container.append($message);
      $('#chats').append($container);
    }
  },
  updateMessages: function() {
    $.get('https://api.parse.com/1/classes/messages', (data) => {
      this.messages = data.results; // is an array
      this.displayMessages();
    });
  },
  init: function() {
    this.updateMessages();
  }

};

app.init();

