import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { todoSelectSchema } from '@/db/schema';
import { z } from 'zod';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router'
import { db } from "@/db/client";
import { useSession } from '@clerk/clerk-expo';
import { todos as todosTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default function TodoApp() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { session } = useSession();

  if (isLoaded && !isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />
  }

  const [todos, setTodos] = useState<(z.infer<typeof todoSelectSchema>)[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const fetchTodos = async () => {
    try {
      if (!session) {
        return;
      }
      const authToken = await session.getToken();
      if (!authToken) {
        return;
      }
      const response = await db
        .$withAuth(authToken)
        .select()
        .from(todosTable);
      setTodos(response);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTitle.trim()) return;
    try {
      if (!session) {
        return;
      }
      const authToken = await session.getToken();
      if (!authToken) {
        return;
      }
      const response = await db
        .$withAuth(authToken)
        .insert(todosTable)
        .values({ title: newTitle, userId: userId });
      setNewTitle('');
      fetchTodos();
    }
    catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      if (!session) {
        return;
      }
      const authToken = await session.getToken();
      if (!authToken) {
        return;
      }
      await db
        .$withAuth(authToken)
        .delete(todosTable)
        .where(eq(todosTable.id, id));
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id: number, updatedTitle: string) => {
    try {
      if (!session) {
        return;
      }
      const authToken = await session.getToken();
      if (!authToken) {
        return;
      }
      await db
        .$withAuth(authToken)
        .update(todosTable)
        .set({ title: updatedTitle })
        .where(eq(todosTable.id, id));
      fetchTodos();
    }
    catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [session]);



  const startEditing = (id: number, title: string) => {
    setEditingId(id);
    setEditingText(title);
  };

  const saveEdit = async (id: number) => {
    if (!editingText.trim()) return;
    await updateTodo(id, editingText);
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a new todo"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <Button title="Add Todo" onPress={addTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            {editingId === item.id ? (
              <TextInput
                style={styles.input}
                value={editingText}
                onChangeText={setEditingText}
                onBlur={() => saveEdit(item.id)}
                autoFocus
              />
            ) : (
              <TouchableOpacity onLongPress={() => startEditing(item.id, item.title || '')}>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            )}
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
  },
  buttons: {
    flexDirection: 'row',
  },
  deleteButton: {
    color: 'red',
  },
});
