/* 
 * Save Content into databse 
 */
grapesjs.plugins.add('save-to-db', function (editor, options) {
  /*
   * Here you should rely on GrapesJS APIs, so check 'API Reference' for more info
   * For example, you could do something like this to add some new command:
   *
   * editor.Commands.add(...);
   */
  editor.Panels.addButton('options', {
    id: 'save-db',
    className: 'fa fa-floppy-o',
    command: 'saveToDb',
    attributes: {
      title: 'Save'
    },
  });

  editor.Commands.add('saveToDb', {
    run: function (editor, sender) {
      sender && sender.set('active', 0)
      editor.store();

      var htmldata = editor.getHtml();
      var cssdata = editor.getCss();
      $.post("sendContent", {
        html: htmldata,
        css: cssdata
      }).done(function (d) {
        console.log(d);
      }).fail(function (d) {
        console.log(d);
      });
    }
  });
});

grapesjs.plugins.add('default-block', function (editor, options) {

  var blockManager = editor.BlockManager;

  blockManager.add('simple-block', {
    label: 'Default',
    attributes: {
      class: 'fa fa-ban'
    },
    content: '<div class="my-block">This is a simple block</div>'
  });

  blockManager.add('map-block', {
    label: 'Map',
    attributes: {
      class: 'fa fa-map-o'
    },
    content: {
      type: 'map',
      style: {
        height: '300px',
        width: '350px'
      }
    },
    draggable: true
  });

  blockManager.add('image-block', {
    label: 'Image',
    attributes: {
      class: 'fa fa-image'
    },
    content: {
      type: 'image'
    }
  });
  blockManager.add('video-block', {
    label: 'Video',
    attributes: {
      class: 'fa fa-video-camera'
    },
    content: {
      type: 'video',
      style: {
        width: '500px',
        height: '400px'
      }
    },
    draggable: true
  });
  blockManager.add('link-block', {
    label: 'Link',
    attributes: {
      class: 'fa fa-link'
    },
    content: {
      type: 'link'
    },
    draggable: true
  });
  blockManager.add('table-block', {
    label: 'Table',
    attributes: {
      class: 'fa fa-table'
    },
    content: {
      type: 'table'
    },
    draggable: true
  });
  blockManager.add('', {
    label: '',
    attributes: {

    },
    content: {
      type: ''
    },
    draggable: true
  });
  blockManager.add('', {
    label: '',
    attributes: {

    },
    content: {
      type: ''
    },
    draggable: true
  });
  blockManager.add('', {
    label: '',
    attributes: {

    },
    content: {
      type: ''
    },
    draggable: true
  });

  blockManager.add('', {
    label: '',
    attributes: {

    },
    content: {
      type: ''
    },
    draggable: true
  });
  blockManager.add('', {
    label: '',
    attributes: {

    },
    content: {
      type: ''
    },
    draggable: true
  });
});
