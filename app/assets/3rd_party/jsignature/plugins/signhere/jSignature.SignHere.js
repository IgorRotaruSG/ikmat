/** @license
jSignature v2 jSignature's Sign Here "sticker" plugin
Copyright (c) 2011 Willow Systems Corp http://willow-systems.com
MIT License <http://www.opensource.org/licenses/mit-license.php>

*/
;(function(){

	var apinamespace = 'jSignature'

	function attachHandlers($obj, apinamespace, extensionName) {

		;(function(jSignatureInstance, $obj, apinamespace) {
			$obj.bind('click', function(){
				// when user is annoyed enough to click on us, hide us
				$obj.hide()
			})

			jSignatureInstance.events.subscribe(
				apinamespace + '.change'
				, function(){
					if (jSignatureInstance.dataEngine.data.length) {
						$obj.hide()
					} else {
						$obj.show()
					}
				}
			)
		})( this, $obj, apinamespace )
	}

	function ExtensionInitializer(extensionName){
		// we are called very early in instance's life.
		// right after the settings are resolved and 
		// jSignatureInstance.events is created 
		// and right before first ("jSignature.initializing") event is called.
		// You don't really need to manupilate 
		// jSignatureInstance directly, just attach
		// a bunch of events to jSignatureInstance.events
		// (look at the source of jSignatureClass to see when these fire)
		// and your special pieces of code will attach by themselves.

		// this function runs every time a new instance is set up.
		// this means every var you create will live only for one instance
		// unless you attach it to something outside, like "window."
		// and pick it up later from there.

		// when globalEvents' events fire, 'this' is globalEvents object
		// when jSignatureInstance's events fire, 'this' is jSignatureInstance

		// Here,
		// this = is new jSignatureClass's instance.

		// The way you COULD approch setting this up is:
		// if you have multistep set up, attach event to "jSignature.initializing"
		// that attaches other events to be fired further lower the init stream.
		// Or, if you know for sure you rely on only one jSignatureInstance's event,
		// just attach to it directly

		var apinamespace = 'jSignature'

		this.events.subscribe(
			// name of the event
			apinamespace + '.attachingEventHandlers'
			// event handlers, can pass args too, but in majority of cases,
			// 'this' which is jSignatureClass object instance pointer is enough to get by.
			, function(){

				var renderer = function(){
					//var data = "data:image/gif;base64,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"
                    var data = "data:image/gif;base64,R0lGODlhtABJAMQQAMTExIiIiE1NTfDw8CAgIGpqai8vL+Hh4aampj4+PrW1tdLS0peXl1tbW3l5eRISEv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRUMzNTdBRTc4NEQxMUUzQkEyRkIwQ0NEMUE2RUEwRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRUMzNTdBRjc4NEQxMUUzQkEyRkIwQ0NEMUE2RUEwRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJFQzM1N0FDNzg0RDExRTNCQTJGQjBDQ0QxQTZFQTBFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJFQzM1N0FENzg0RDExRTNCQTJGQjBDQ0QxQTZFQTBFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAEAAsAAAAALQASQAABf8gJI5kaZ5oqq5s675wLM90bd94ru987//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vDB8ChBDghBAx3ZwcFBA+HDw0IEAAPJgeIfU4LApWWlwsjDpecDnMIhwQFAQ4JoYcmC4iLTgMAAQaIDwQBAAMjCwgFsg8FCJlxCocJtyMAsagmDolTA4aHwCfLhw11z5IkA6aOXQKIKsKHrHLhCSiQ3FzeySiNh9hxAYcCKbte6+kn7g/wcPKHe04Iu/ctxb5+b/YROzEgH4k8xfQBmBiRoS1jemTgU3GQIwIGFy0Wm9juY0gksgj/KNBnQkGDdycCGHrWa+JEYAB28YOgANkDA9FabDQYiaHMlAH46LS1jkBACAOOIqKV5B8iAU9PMPC5s8QuAggGEOL1QMAxWa/IEqi4Ymi7oiW0/WSgYNoDc4y4Ath2qIAIuQbo2sV7RKesAmyNKTDc7984CDppBfiFwOpLBwsA4Avkwq0+uCRMJR3BAFFSAHWv0kLGyhRnEVZHF1Yr+xFoqAVHoHsQFMLUoDrpdTYdoLhx44xLgCI8YtvaEbKAKVgJobTw0KGU9CRrAKGI2/tMPKsN4Rl10vNe4CPLvuuIWOQhWMU2/kSs15puG4lKE9F5ErdZZcI65K3TjzvXseCZ/wkd6TYMJwL4JJuBqTzIiU+PITFWSr35BtMI4TzAFoElUEgCgurl9tmHIrgzynEwYmMiCeG8CKNx3h2xlywGmHDbbv9BgEyQM7aY3nDsrOiefOIgidA/QS5xQJQjGPZAVh4uCcE0CbrDnAhFMnKkUCoyGOAh8aEQJpMPpJmEZiq81CSALFY5jy1b/YQlBGGiiKRDfNxW2l1OmvDPl0s0khguppWgH5i8iLJon2MqWGagdTaozDhrhrinCAVQ6UMjGZaADH5ZIrRLHzepQGlZKSZpZp0NDXPCAQTIWKcIuyEKASQd/tCIAYt+B42ju8rjV6EnVtrWpc3uik8DFWnT4/8Ia/KJCGLZJHAtES4u+k+Cv+o3E0g2BSvCNZgSECugJIByCKr7zDURArE81uishwQ2UZ6ijoqIAUEeylaI+O3WngEBRFTrA56QYFWxJSis7gByMlOCXWRV4yA1KHDMy7JFNBJhKAIUIMAzAlT0Ck0EOICNVe3BSkh/o8iX8U8BfPprAOvN0kDPI+jS310OPEbzVSMVwFUCaYrcF8Wj4rUA0M8QoAiDN9YywgAGCAD0JbwccEDXSaHt89loEy1CZWhnSEgsWj/2StftOC10qWFYW+wBL7kpCBkv8f11m4OrEU6ORgacOBhyEovCAgSQ+zgZ+4iCgE0A6HIX1Zd/MWg4zdSGrsYChURaAOOml+EKRa3HLvvstNdu++2456777rz37vvvwAcv/PDEF2/88cgnr/zyzDfPRggAOw=="
					, $img = $('<img style="position:absolute !important; top: auto; min-width:90px !important; max-width:180px !important;width:10% !important;border:none !important;padding: 0 !important;margin:0 !important;box-shadow:0 0 0 !important;" />')
					try {
						$img[0].src = data
						return $img
					} catch (ex) {
						return $() // empty jQuery obj
					}
				}
				if (this.settings[extensionName] && typeof this.settings[extensionName].renderer === 'function') {
					renderer = this.settings[extensionName].renderer
				}

				var $obj = renderer()

				if ($obj.length) {
					$obj.appendTo(this.$controlbarUpper)

					attachHandlers.call( 
						this
						, $obj
						, apinamespace
						, extensionName
					)
				}
			}
		)
	}

	var ExtensionAttacher = function(){
		$.fn[apinamespace](
			'addPlugin'
			, 'instance' // type of plugin
			, 'SignHere' // extension name
			, ExtensionInitializer
		)
	}
	

//  //Because plugins are minified together with jSignature, multiple defines per (minified) file blow up and dont make sense
//	//Need to revisit this later.
	
//	if ( typeof define === "function" && define.amd != null) {
//		// AMD-loader compatible resource declaration
//		// you need to call this one with jQuery as argument.
//		define(function(){return Initializer} )
//	} else {
		ExtensionAttacher()
//	}

})();