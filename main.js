const { join } = require('path')
const morgan = require('morgan')
const cors = require('cors')
const fortune = require('fortune-cookie')
const express = require('express')
const hbs = require('express-handlebars')

const PORT = parseInt(process.argv[2] || process.env.APP_PORT || process.env.PORT) || 3000
const FORTUNES = fortune.length;

const getFortune = () => {
	let i =  parseInt(Math.random() * FORTUNES);
	return fortune[i];
}

const getNumber = () => {
	let i = parseInt(Math.random() * 30);
	return `numbers/number${i}.jpg`
}

const app = express();

app.engine('hbs', hbs());
app.set('view engine', 'hbs')

app.use(morgan('tiny'));
app.use(cors());

app.get(['/', '/index.html'], (req, resp) => {
	resp.status(200)
	resp.format({
		'text/html': () => {
			resp.type('text/html')
			resp.render('fortune', 
				{ text: getFortune(), image: getNumber(), port: PORT, layout: false }
			)
		},
		'application/json': () => {
			resp.type('application/json');
			resp.json({ fortune: getFortune() });
		},
		'default': () => {
			resp.status(406).end();
		}
	})
})

app.get('/healthz', (req, resp) => {
	resp.status(200).json({ timestamp: (new Date()).getTime() })
})

app.get('/health', (req, resp) => {
	resp.status(200)
	resp.type('text/plain')
	resp.end(`OK ${new Date()}`);
})

app.use('/assets', express.static(join(__dirname, 'assets')));
app.use(express.static(join(__dirname, 'public')));

app.use((req, resp) => {
	resp.status(404)
	resp.format({
		'text/html': () => {
			resp.type('text/html')
			resp.sendFile(join(__dirname, 'public', '404.html'))
		},
		'application/json': () => {
			resp.type('application/json');
			resp.json({ error: 'not found' })
		},
		'default': () => {
			resp.type('text/plain').end('Not found');
		}
	})
})

app.listen(PORT, () => {
	console.info('Application started on port %d at %s', PORT, new Date());
});
