import { PageLayout } from "@renderer/components/PageLayout";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusOutlined, RollbackOutlined } from '@ant-design/icons'
import { Button, Flex, Space, Table, TableColumnProps } from "antd";
import { ProviderModal } from "@renderer/components/ProviderModal";
import { useModal } from "@renderer/hooks/useModal";
import React from "react";
import { Provider } from "@renderer/components/entities";
import { storage } from "@renderer/components/Storage";

const tableActions = React.createContext({
	onEdit: (_id: string) => {},
	onRemove: (_id: string) => {}
});

function ColumnAction ({ item }: { item: Provider }) {
	const { onEdit, onRemove } = React.useContext(tableActions);
	
	const click = React.useCallback(() => {
		onEdit(item.id);
	}, [ item, onEdit ]);

	const remove = React.useCallback(() => {
		onRemove(item.id);
	}, [ item, onRemove ]);
	
	return (
		<Flex gap={8} justify="end">
			<Button size="small" onClick={click} icon={<EditOutlined />} />
			<Button size="small" onClick={remove} danger icon={<DeleteOutlined />} />
		</Flex>
	)
}

const providerTable: TableColumnProps<Provider>[] = [
	{ title: "Name", dataIndex: "name" },
	{ title: "Provider", dataIndex: "provider" },
	{ title: "", dataIndex: "id", render: (_, i) => <ColumnAction item={i} /> }
]	

export function Settings () {

	const provider = useModal<string>();

	const [ providers, setProviders ] = React.useState<Provider[]>([])

	const loadProviders = React.useCallback(async () => {
		const items = await storage.providers.list();
		setProviders(items);
	}, []);

	React.useEffect(() => {
		loadProviders()
	}, [ loadProviders ]);

	const remove = React.useCallback(async (id: string) => {
		await storage.providers.delete(id);
		loadProviders();
	}, [ loadProviders ]);

	return (
		<PageLayout 
			title="Settings"
			menu={
				<Link to="/">
					<Button icon={<RollbackOutlined />} />
				</Link>
			}>
			<Space direction="vertical" style={{ width: "100%" }}>
				<Flex justify="end">
					<Button onClick={provider.openNew} icon={<PlusOutlined />}>Provider</Button>
				</Flex>
				<tableActions.Provider value={{
					onEdit: provider.openEdit,
					onRemove: remove
				}}>
					<Table 
						columns={providerTable}
						dataSource={providers}
					/>
				</tableActions.Provider>
			</Space>
			<ProviderModal 
				visible={provider.visible} 
				toggle={provider.close} 
				onSave={loadProviders}
				value={provider.value}
			/>
		</PageLayout>
	)
}