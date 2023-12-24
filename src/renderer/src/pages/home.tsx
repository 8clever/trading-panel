import { Button, Flex, Form, InputNumber, Select, Typography, notification } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, SettingOutlined } from '@ant-design/icons'
import React from "react";
import { PageLayout } from "@renderer/components/PageLayout";
import { Link } from "react-router-dom";
import { storage } from "@renderer/components/Storage";
import { Provider } from "@renderer/components/entities";
import type { Ticker, Tickers } from "ccxt";


export function Home () {

	const [ form ] = Form.useForm();

	const [ providers, setProviders ] = React.useState<Provider[]>([]);

	const [ tickers, setTickers ] = React.useState<Tickers>({});

	const [ ticker, setTicker ] = React.useState<Ticker | null>(null)

	const selectedProviderId: string = Form.useWatch('provider', form);

	const selectedSymbol: string = Form.useWatch('symbol', form);

	const [ loading, setLoading ] = React.useState<'load-symbols' | 'load-open-long' | 'load-open-short' | 'none'>('none')

	const provider = React.useMemo(() => {
		if (selectedProviderId)
			return providers.find(p => p.id === selectedProviderId);
		return null;
	}, [ providers, selectedProviderId ]);

	React.useEffect(() => {
		if (!provider) return;

		(async () => {
			setLoading('load-symbols')
			try {
				const tickers: Tickers = await window.exchangeApi(provider, 'fetchTickers');
				setTickers(tickers);
			} finally {
				setLoading('none');
			}
		})()
	}, [ provider ]);

	React.useEffect(() => {
		(async () => {
			const data = await storage.providers.list()
			setProviders(data);
		})();
	}, []);

	React.useEffect(() => {
		if (!selectedSymbol) return;
		if (!provider) return;

		const loadTickers = async () => {
			const ticker: Ticker = await window.exchangeApi(provider!, 'fetchTicker', selectedSymbol);
			console.info('LOAD:', ticker.symbol, ticker.close)
			setTicker(ticker);
		}

		loadTickers();
		const watch = setInterval(loadTickers, 3000);

		return () => {
			clearInterval(watch);
		}
	}, [ selectedSymbol, provider ]);

	const openPosition = React.useCallback(async (diretion: "long" | "short") => {
		if (!provider) return;
		if (!ticker) return;

		setLoading(`load-open-${diretion}`);
		const { margin } = await form.validateFields() as { tp: number, sl: number, margin: number };
		const price = diretion === 'long' ? ticker.ask : ticker.bid;
		const symbol = ticker.symbol;
		const amount = margin / price!
		const side = diretion === "long" ? "buy" : "sell";
		const type = 'market';
		const params = {};
		try {
			const order = await window.exchangeApi(provider, 'createOrder', symbol, type, side, amount, price, params);
			console.log(order);
		} catch (e) {
			notification.error({ message: (e as Error).message });
		} finally {
			setLoading('none')
		}
	}, [ provider, ticker, form.validateFields ]);

	const openLong = React.useCallback(() => {
		openPosition('long');
	}, [ openPosition ])

	const openShort = React.useCallback(() => {
		openPosition('short');
	}, [ openPosition ])

	return (
		<PageLayout 
			title="Trading Panel" 
			menu={
				<Link to="/settings">
					<Button icon={<SettingOutlined />} />
				</Link>
			}>
			<Form form={form} style={{ maxWidth: 450, margin: "auto" }}>
				{
					ticker ?
					<Typography.Title type="secondary">BID/ASK {ticker.bid}/{ticker.ask}</Typography.Title> :
					null
				}
				<Form.Item name="provider">
					<Select placeholder='Provider'>
						{providers.map(p => {
							return <Select.Option value={p.id} key={p.id}>{p.name} - {p.provider}</Select.Option>
						})}
					</Select>
				</Form.Item>
				<Form.Item name={'symbol'}>
					<Select disabled={loading === 'load-symbols'} loading={loading === 'load-symbols'} placeholder='Symbol' showSearch>
						{Object.keys(tickers).map(s => {
							return <Select.Option value={s} key={s}>{s}</Select.Option>
						})}
					</Select>
				</Form.Item>
				<Form.Item name="margin">
					<InputNumber placeholder="Margin" style={{ width: '100%'}} />
				</Form.Item>
				<Flex gap={8}>
					<Form.Item name="tp" style={{ width: "100%" }}>
						<InputNumber style={{ width: "100%" }} placeholder="TP %"/>
					</Form.Item>
					<Form.Item name="sl" style={{ width: "100%" }}>
						<InputNumber style={{ width: "100%" }} placeholder="SL %"/>
					</Form.Item>
				</Flex>
				<Flex gap={8}>
					<Button loading={loading === 'load-open-long'} onClick={openLong} block type="primary" icon={<ArrowUpOutlined />}>Open Long</Button>
					<Button loading={loading === 'load-open-short'} onClick={openShort} block icon={<ArrowDownOutlined />}>Open Short</Button>
				</Flex>
			</Form>
		</PageLayout>
	)
}