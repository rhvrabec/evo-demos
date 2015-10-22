// Application code for the Evothings Viewer app.

// Debug logging used when developing the app in Evothings Studio.
/*
if (window.hyper && window.hyper.log)
{
	console.log = hyper.log
	console.error = hyper.log
}
*/

// Application object.
var app = {}

// Production server address.
app.defaultServerAddress = 'https://deploy.evothings.com'

app.initialize = function()
{
	app.hideSpinner()
	app.setConnectButtonColor()

	$('#button-connect').on('click', app.onConnectButton)
	$('#input-connect-key').on('input', app.setConnectButtonColor)
}

app.setConnectButtonColor = function()
{
	var value = $('#input-connect-key').val().trim()
	if (value.length < 1)
	{
		$('#button-connect').removeClass('stone')
		$('#button-connect').addClass('charcoal')
	}
	else
	{
		$('#button-connect').removeClass('charcoal')
		$('#button-connect').addClass('stone')
	}
}

app.onConnectButton = function()
{
	app.showMessage('Connecting...')
	app.showSpinner()

	// Get contents of url text field.
	var keyOrURL = $('#input-connect-key').val().trim()

	// Does it look like a URL?
	if ((0 == keyOrURL.indexOf('http://')) ||
		(0 == keyOrURL.indexOf('https://')))
	{
		// Open the URL.
		window.location.assign(keyOrURL)
	}
	else
	{
		// Not a URL, assuming a connect code.
		// Check if the code exists and connect to the server if ok.
		app.getServerForConnectKey(keyOrURL)
	}
}

/**
 * Ask server set in app for which server to use to connect, based on the connect key.
 */
app.getServerForConnectKey = function(key)
{
	// Ask the default server for which server to use with this key.
	var requestURL = app.getServerAddress() + '/get-info-for-connect-key/' + key

	var request = $.ajax(
		{
			timeout: 5000,
			url: requestURL,
		})

	request.done(function(data)
	{
		if (data.isValid && data.serverAddress)
		{
			// Store the server address for this key.
			localStorage.setItem('session-server-address', data.serverAddress)

			// Validate key with the server and connect.
			app.validateConnectKeyAndConnect(key, data.serverAddress)
		}
		else
		{
			app.showMessage('Could not find server for connect key, please retype the key or try with a new key.')
			app.hideSpinner()
		}
	})

	request.fail(function(jqxhr)
	{
		app.showMessage('Could not connect. Please check your Internet connection and try again.')
		app.hideSpinner()
	})
}

app.validateConnectKeyAndConnect = function(key, serverAddress)
{
	// Check that key exists.
	var requestURL = serverAddress + '/validate-connect-key/' + key
	var request = $.ajax(
		{
			timeout: 5000,
			url: requestURL,
		})

	// If key exists, connect to Workbench.
	request.done(function(data)
	{
		if (!data.isValid)
		{
			app.showMessage('Invalid or expired key, please get a new key and try again.')
			app.hideSpinner()
		}
		else if (data.clientID)
		{
			// Connect.
			var serverURL = serverAddress + '/connect-with-client-id/' + data.clientID
			window.location.assign(serverURL)
		}
		else
		{
			app.showMessage('Something went wrong. Server did not respond as expected.')
			app.hideSpinner()
		}
	})

	request.fail(function(jqxhr)
	{
		app.showMessage('Could not validate the connect key. Please check your Internet connection and try again.')
		app.hideSpinner()
	})
}

app.getServerAddress = function()
{
	return app.defaultServerAddress
}

app.showMessage = function(message)
{
	$('#message').html(message)
}

app.showSpinner = function()
{
	$('#spinner').show()
}

app.hideSpinner = function()
{
	$('#spinner').hide()
}

app.openBrowser = function(url)
{
	window.open(url, '_system', 'location=yes')
}

app.initialize()
