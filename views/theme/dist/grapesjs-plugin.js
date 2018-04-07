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
        jups_html: htmldata,
        jups_css: cssdata
      }).done(function (d) {
        console.log(d);
      }).fail(function (d) {
        console.log(d);
      });
    }
  });
});
