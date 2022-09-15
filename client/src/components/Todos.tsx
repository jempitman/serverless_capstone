import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoName: string
  loadingTodos: boolean
  dueDate: boolean
  ascending: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoName: '',
    loadingTodos: true,
    dueDate: false,
    ascending: false
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  // With assistance from https://codesandbox.io/s/semantic-ui-example-forked-ls0yml?file=/example.js
  // as well as this question in the Udacity Knowledge Forum (https://knowledge.udacity.com/questions/
  //897200?utm_campaign=ret_600_auto_ndxxx_knowledge-comment-created_na&utm_source=blueshift&utm_medium
  //=email&utm_content=ret_600_auto_ndxxx_knowledge-comment-created_na&bsft_clkid=9847c7e7-9f10-4eb6-
  //b646-ec15c5f0dd52&bsft_uid=bc7eb4e0-674e-4a85-b3d9-4f75aa009b60&bsft_mid=6bb28aed-e03e-4ab5-bb68-
  //74cdcc30be0b&bsft_eid=64e4ccff-21b0-44a8-abc6-a9081789abfc&bsft_txnid=16955baa-7156-4cab-b046-
  //5509cb0b9bde&bsft_mime_type=html&bsft_ek=2022-09-08T09%3A05%3A44Z&bsft_aaid=8d7e276e-4a10-41b2-
  //8868-423fe96dd6b2&bsft_lx=1&bsft_tv=1#897211)

  sortHandleClick = () =>  {
    try{

      const compare = (a: Todo, b: Todo) => {
        if (a.dueDate > b.dueDate) {
          return this.state.ascending ? -1 : 1
        }
        if (a.dueDate < b.dueDate) {
          return this.state.ascending ? 1 : -1
        }
        return 0
      }

      const sortedTodos = this.state.todos.sort(compare)
      this.setState({
        todos: [...sortedTodos],
        ascending: !this.state.ascending
      })
    

    }catch (e:any) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
    
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newTodoName,
        dueDate
      })
      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoName: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }
  

  onTodoCheck = async (pos: number) => {
    try {
      const todo = this.state.todos[pos]
      await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
        name: todo.name,
        dueDate: todo.dueDate,
        done: !todo.done
      })
      this.setState({
        todos: update(this.state.todos, {
          [pos]: { done: { $set: !todo.done } }
        })
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async fetchTodos(){
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch(e:any){
      alert(`Failed to fetch sorted todos: ${e.message}`)
    }
  }

  async fetchTodosByCreatedAtDate(){
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch(e:any){
      alert(`Failed to fetch sorted todos: ${e.message}`)
    }



  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false,
        // dueDate: false
      })
    } catch (e:any) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">TODOs</Header>

        {this.renderCreateTodoInput()}

        {this.renderSortButton()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onTodoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  // With assistance from https://codesandbox.io/s/semantic-ui-example-forked-ls0yml?file=/example.js
  renderSortButton() {
    const { dueDate } = this.state;

    return (
      <Button toggle active={dueDate} onClick={this.sortHandleClick}>
        Sort Todos by due Date
      </Button>
    )
  }


  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.todoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }


}
