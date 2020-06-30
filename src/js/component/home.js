import React from "react";

const URL_BASE = "https://assets.breatheco.de/apis/fake/todos/user";
const DEFAULT_USER = "/toDoListLuis";

export class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			todos: [],
			isLoading: false,
			error: null,
			taskInput: ""
		};
	}

	componentDidMount() {
		this.setState({ isLoading: true });
		fetch(URL_BASE + DEFAULT_USER, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Something went wrong ...");
				}
			})
			.then(
				data =>
					data.map(todo => {
						this.setState({
							todos: this.state.todos.concat([
								{
									label: todo.label,
									done: todo.done,
									id: todo.id
								}
							])
						});
					}),
				this.setState({ isLoading: false })
			)
			.catch(error => this.setState({ error, isLoading: false }));
	}

	formSubmit(e) {
		e.preventDefault();
		var newTodo = {
			label: this.state.taskInput,
			done: false,
			id: Math.random() * 10
		};

		this.setState({
			todos: this.state.todos.concat([
				{
					label: newTodo.label,
					done: newTodo.done,
					id: newTodo.id
				}
			]),
			taskInput: ""
		});

		var todos = this.state.todos.concat([newTodo]);

		if (todos.length == 1) {
			fetch(URL_BASE + DEFAULT_USER, {
				method: "POST",
				body: JSON.stringify(todos),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(response => response.json())
				.catch(error => console.error("Error:", error))
				.then(response => console.log("Success:", response));
		} else {
			fetch(URL_BASE + DEFAULT_USER, {
				method: "PUT",
				body: JSON.stringify(todos),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(response => response.json())
				.catch(error => console.error("Error:", error))
				.then(response => console.log("Success:", response));
		}

		return false;
	}

	deleteTask(taskId) {
		this.setState({
			todos: this.state.todos.filter(task => task.id != taskId)
		});

		var todos = this.state.todos.filter(task => task.id != taskId);

		if (todos.length >= 1) {
			fetch(URL_BASE + DEFAULT_USER, {
				method: "PUT",
				body: JSON.stringify(todos),
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(response => response.json())
				.catch(error => console.error("Error:", error))
				.then(response => console.log("Success:", response));
		} else {
			fetch(URL_BASE + DEFAULT_USER, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			})
				.then(response => response.json())
				.catch(error => console.error("Error:", error))
				.then(response => console.log("Success:", response));
		}
	}

	render() {
		const { todos, isLoading, error } = this.state;
		if (error) {
			return <p>{error.message}</p>;
		}

		if (isLoading) {
			return <p>Loading ...</p>;
		}

		var tasksToRender = todos.map(task => {
			return (
				<li key={task.id}>
					<span>
						<button
							className="destroy"
							onClick={() => this.deleteTask(task.id)}>
							<i className="fa fa-trash" />
						</button>
					</span>
					<label>{task.label}</label>
				</li>
			);
		});
		return (
			<div id="container">
				<h1 className="todo-header">To do List</h1>
				<form onSubmit={this.formSubmit.bind(this)}>
					<input
						autoFocus={true}
						className="addToDo"
						placeholder="Que necesitas hacer?"
						value={this.state.taskInput}
						onChange={evt =>
							this.setState({ taskInput: evt.target.value })
						}
					/>
				</form>
				<ul className="todo-list">{tasksToRender}</ul>
			</div>
		);
	}
}
