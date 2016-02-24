var $sigdiv;
function signature_testInit() {
    $sigdiv = $("#signature").jSignature();
    $sigdiv.jSignature("reset");

    $('#signature-reset').off('click').on('click', function(){
        $sigdiv.jSignature("reset")
    });

    $('#signature-show').off('click').on('click', function(){
        var datapair = $sigdiv.jSignature("getData", "svgbase64");
        var i = new Image();
        i.src = "data:" + datapair[0] + "," + datapair[1];
        $("#signature-container").html('');
        $(i).appendTo($("#signature-container"));
    });
}

$( window ).on( "orientationchange", function( event ) {
    $sigdiv.jSignature("reset");
    if (event.orientation == 'landscape') {
        $('#signature-status-message').hide();
    } else {
        $('#signature-status-message').show();
    }
});