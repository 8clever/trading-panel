import { Button, Flex, Form, InputNumber, Select } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, SettingOutlined } from '@ant-design/icons'
import React from "react";
import { PageLayout } from "@renderer/components/PageLayout";
import { Link } from "react-router-dom";
import { storage } from "@renderer/components/Storage";
import { Provider } from "@renderer/components/entities";
import type { Tickers } from "ccxt";


export function Home () {

	const [ form ] = Form.useForm();

	const [ providers, setProviders ] = React.useState<Provider[]>([]);

	const [ tickers, setTickers ] = React.useState<Tickers>({});

	const [ loadTickers, setLoadTickers ] = React.useState(false);

	const selectedProviderId: string = Form.useWatch('provider', form);

	const provider = React.useMemo(() => {
		if (selectedProviderId)
			return providers.find(p => p.id === selectedProviderId);
		return null;
	}, [ providers, selectedProviderId ]);

	React.useEffect(() => {
		if (!provider) return;

		(async () => {
			setLoadTickers(true)
			try {
				const tickers: Tickers = await window.exchangeApi(provider, 'fetchTickers');
				setTickers(tickers);
			} finally {
				setLoadTickers(false);
			}
		})()
	}, [ provider ]);

	React.useEffect(() => {
		(async () => {
			const data = await storage.providers.list()
			console.log(data)
			setProviders(data);
		})();
	}, []);

	return (
		<PageLayout 
			title="Trading Panel" 
			menu={
				<Link to="/settings">
					<Button icon={<SettingOutlined />} />
				</Link>
			}>
			<Form form={form} style={{ maxWidth: 450, margin: "auto" }}>
				<Form.Item name="provider">
					<Select placeholder='Provider'>
						{providers.map(p => {
							return <Select.Option value={p.id} key={p.id}>{p.name} - {p.provider}</Select.Option>
						})}
					</Select>
				</Form.Item>
				<Form.Item name={'symbol'}>
					<Select disabled={loadTickers} loading={loadTickers} placeholder='Symbol' showSearch>
						{Object.keys(tickers).map(s => {
							return <Select.Option value={s} key={s}>{s}</Select.Option>
						})}
					</Select>
				</Form.Item>
				<Form.Item name="margin">
					<InputNumber placeholder="Margin" style={{ width: '100%'}} />
				</Form.Item>
				<Flex gap={8}>
					<Button block type="primary" icon={<ArrowUpOutlined />}>Open Long</Button>
					<Button block icon={<ArrowDownOutlined />}>Open Short</Button>
				</Flex>
			</Form>
		</PageLayout>
	)
}