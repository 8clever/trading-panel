import React from "react";

interface ModalState<T> {
	visible: boolean;
	value: T | null 
}

export function useModal<T> () {
	const [ modal, setModal ] = React.useState<ModalState<T>>({
		visible: false,
		value: null
	});

	const close = React.useCallback(() => {
		setModal({
			value: null,
			visible: false
		})
	}, []);

	const openNew = React.useCallback(() => {
		setModal({
			value: null,
			visible: true
		})
	}, []);

	const openEdit = React.useCallback((value: T) => {
		setModal({
			value,
			visible: true
		})
	}, [])

	return {
		...modal,
		close,
		openNew,
		openEdit
	}
}