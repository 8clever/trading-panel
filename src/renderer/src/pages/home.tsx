import { Button, Flex, Form, InputNumber, Select, Space, Table, TableColumnsType, Typography, notification } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, SettingOutlined, DeleteOutlined } from '@ant-design/icons'
import React from "react";
import { PageLayout } from "@renderer/components/PageLayout";
import { Link } from "react-router-dom";
import { storage } from "@renderer/components/Storage";
import { Provider } from "@renderer/components/entities";
import type { Market, Position, Ticker } from "ccxt";

const positionTable = React.createContext({
	onRemove: (_i: Position) => Promise.resolve()
});

function PositionActions ({ i }: { i: Position }) {
	const { onRemove } = React.useContext(positionTable);
	const [ loading, setLoading ] = React.useState<'remove' | 'none'>('none');
	const remove = React.useCallback(() => {
		setLoading('remove')
		onRemove(i).finally(() => {
			setLoading('none')
		});
	}, [ onRemove, i ]);
	return (
		<Flex justify="end">
			<Button loading={loading === "remove"} onClick={remove} size="small" danger icon={<DeleteOutlined />}/>
		</Flex>
	)
}

const positionColumns: TableColumnsType<Position> = [
	{ title: "Symbol", key: "symbol", dataIndex: "symbol"},
	{ title: "Side", key: "side", dataIndex: "side"},
	{ title: "PNL", key: "unrealizedPnl", dataIndex: "unrealizedPnl" },
	{ title: "", key: "actions", dataIndex: "id", render: (_, i) => <PositionActions i={i} /> },
]

export function Home () {

	const [ form ] = Form.useForm();

	const [ providers, setProviders ] = React.useState<Provider[]>([]);

	const [ markets, setMarkets ] = React.useState<Market[]>([]);

	const [ ticker, setTicker ] = React.useState<Ticker | null>(null)

	const [ positions, setPositions ] = React.useState<Position[]>([]);

	const selectedProviderId: string = Form.useWatch('provider', form);

	const selectedSymbol: string = Form.useWatch('symbol', form);

	const [ loading, setLoading ] = React.useState<'load-markets' | 'load-open-long' | 'load-open-short' | 'load-ticker' | 'none'>('none')

	const provider = React.useMemo(() => {
		if (selectedProviderId)
			return providers.find(p => p.id === selectedProviderId);
		return null;
	}, [ providers, selectedProviderId ]);

	React.useEffect(() => {
		if (!provider) return;

		(async () => {
			setLoading('load-markets')
			try {
				const markets = await window.exchangeApi(provider, 'fetchMarkets');
				setMarkets(markets);
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
			setTicker(ticker);
		}

		setLoading('load-ticker');
		loadTickers().finally(() => {
			setLoading('none');
		});
		const watch = setInterval(loadTickers, 3000);

		return () => {
			clearInterval(watch);
		}
	}, [ selectedSymbol, provider ]);

	/**
	 * We have some problem with TP/SL CCXT BingX
	 * We don't work with directions only with positions BUY or SELL
	 * for long TP/SL Should be as SELL position
	 * 1. Create Order without TP/SL
	 * 2. Create Order with TP/SL opposite direction
	 */
	const openPosition = React.useCallback(async (direction: "long" | "short") => {
		if (!provider) return;
		if (!ticker) return;

		setLoading(`load-open-${direction}`);
		const { margin, tp, sl } = await form.validateFields() as { tp: number, sl: number, margin: number };
		const islong = direction === 'long';
		const price = islong ? ticker.ask : ticker.bid;
		const symbol = ticker.symbol;
		const amount = margin / price!
		const type = 'market';
		const params: Record<string, object | number> = {};
		const side = islong ? "buy" : "sell";
		if (tp && price) {
			const range = price / 100 * tp
			const triggerPrice = islong ? price + range : price - range;
			params.takeProfitPrice = triggerPrice;
		}
		if (sl && price) {
			const range = price / 100 * sl;
			const triggerPrice = islong ? price - range : price + range;
			params.stopLossPrice = triggerPrice
		}
		try {
			await window.exchangeApi(provider, 'createOrder', symbol, type, side, amount, price, {});
			for (const trigger of Object.keys(params)) {
				const oppositeside = side === "buy" ? "sell" : 'buy';
				await window.exchangeApi(provider, 'createOrder', symbol, type, oppositeside, amount, price, { [trigger]: params[trigger] });
			}
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
	}, [ openPosition ]);

	const loadPositions = React.useCallback(async () => {
		if (!provider) return;
		const positions = await window.exchangeApi(provider, 'fetchPositions');
		setPositions(positions);
	}, [ provider ]);

	React.useEffect(() => {
		loadPositions();
		const watch = setInterval(loadPositions, 10000);
		return () => {
			clearInterval(watch);
		}
	}, [ loadPositions ]);

	const closePosition = React.useCallback(async (i: Position) => {
		if (!provider) return;
		await window.exchangeApi(provider, 'closePosition', i.symbol, i.side, { id: i.id })
	}, [ provider ]);

	return (
		<PageLayout 
			title="Trading Panel" 
			menu={
				<Link to="/settings">
					<Button icon={<SettingOutlined />} />
				</Link>
			}>
			<div style={{ textAlign: "center" }}>
				<Typography.Title type="secondary">
					{
						loading === "load-ticker" ? 'Load Ticker...' :
						ticker ? <>BID/ASK {ticker.bid}/{ticker.ask}</> : 
						"Offline"
					}
				</Typography.Title>
				<Space direction="vertical" size="large">
					<Form form={form}>
						<Form.Item name="provider">
							<Select placeholder='Provider'>
								{providers.map(p => {
									return <Select.Option value={p.id} key={p.id}>{p.name} - {p.provider}</Select.Option>
								})}
							</Select>
						</Form.Item>
						<Form.Item name={'symbol'}>
							<Select disabled={loading === 'load-markets'} loading={loading === 'load-markets'} placeholder='Symbol' showSearch>
								{markets.map(m => {
									if (!m) return null;
									return <Select.Option value={m.symbol} key={m.symbol}>{m.symbol}</Select.Option>
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
					<positionTable.Provider value={{ onRemove: closePosition }}>
						<Table columns={positionColumns} dataSource={positions} />
					</positionTable.Provider>
				</Space>
			</div>
		</PageLayout>
	)
}