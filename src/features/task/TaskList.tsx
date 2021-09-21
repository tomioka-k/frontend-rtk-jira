import { makeStyles, Theme } from "@material-ui/core";
import {
	AddCircleOutline,
	DeleteOutlineOutlined,
	EditOutlined,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import styles from "./TaskList.module.css";

import {
	Button,
	Avatar,
	Badge,
	Table,
	TableHead,
	TableCell,
	TableRow,
	TableBody,
	TableSortLabel,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
	editTask,
	fetchAsyncDeleteTask,
	selectTask,
	selectTasks,
} from "./taskSlice";
import { selectLoginUser, selectProfiles } from "../auth/authSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./taskSlice";
import { SORT_STATE, READ_TASK } from "../types";

const useStyles = makeStyles((theme: Theme) => ({
	table: {
		tableLayout: "fixed",
	},
	button: {
		margin: theme.spacing(3),
	},
	small: {
		margin: "auto",
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
}));

const TaskList: React.FC = () => {
	const classes = useStyles();
	const dispath: AppDispatch = useDispatch();
	const tasks = useSelector(selectTasks);
	const loginUser = useSelector(selectLoginUser);
	const profiles = useSelector(selectProfiles);
	const columns = tasks[0] && Object.keys(tasks[0]);

	const [state, setState] = useState<SORT_STATE>({
		rows: tasks,
		order: "desc",
		activeKey: "",
	});

	const handleClickSortColumn = (column: keyof READ_TASK) => {
		const isDesc = column === state.activeKey && state.order === "desc";
		const newOrder = isDesc ? "asc" : "desc";
		const sortedRows = Array.from(state.rows).sort((a, b) => {
			if (a[column] > b[column]) {
				return newOrder === "asc" ? 1 : -1;
			} else if (a[column] < b[column]) {
				return newOrder === "asc" ? -1 : 1;
			} else {
				return 0;
			}
		});
		setState({
			rows: sortedRows,
			order: newOrder,
			activeKey: column,
		});
	};

	useEffect(() => {
		setState((state) => ({
			...state,
			rows: tasks,
		}));
	}, [tasks]);

	const renderSwitch = (statusName: string) => {
		switch (statusName) {
			case "Not started":
				return (
					<Badge variant="dot" color="error">
						{statusName}
					</Badge>
				);
			case "On going":
				return (
					<Badge variant="dot" color="primary">
						{statusName}
					</Badge>
				);
			case "Done":
				return (
					<Badge variant="dot" color="secondary">
						{statusName}
					</Badge>
				);
			default:
				return null;
		}
	};

	const coniditionalSrc = (user: number) => {
		const loginProfile = profiles.filter(
			(prof) => prof.user_profile === user
		)[0];
		return loginProfile?.img !== null ? loginProfile?.img : undefined;
	};

	return <div></div>;
};

export default TaskList;
