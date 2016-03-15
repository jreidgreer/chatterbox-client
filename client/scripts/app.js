// YOUR CODE HERE:

var app = {
  messages: '',
  server: 'https://api.parse.com/1/classes/messages',
  clearMessages: function() {
    $('#chats').empty();
  },
  displayMessages: function() {
    this.clearMessages();
    for (var i = 0; i < this.messages.length; i++) {
      var current = this.messages[i];
      if (!current.text || !current.username || 
        current.text.length === 0 || current.username.length === 0) {
        continue;
      }
      var $container = $('<div class="chat"></div>');
      var $name = $('<div class="username"></div>');
      var $message = $('<div class="message"></div>');
      $name.text(JSON.stringify(current.username));
      $container.append($name);
      $message.text(JSON.stringify(current.text));
      $container.append($message);
      $('#chats').append($container);
    }
  },
  fetch: function() {
    $.ajax({
      url: this.server,
      type: 'GET', 
      contentType: 'application/json',
      success: (data) => {
        this.messages = data.results; // is an array
        this.displayMessages();
      },
      error: function(data) {
        console.error('chatterbox: Failed to get messages', data);
      }
    });
  },
  init: function() {
    this.fetch();
  },

  send: function(message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

};

app.init();

