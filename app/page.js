'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, CircularProgress, TextField, Modal, Grid } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import MuiAlert from '@mui/material/Alert';
import SpinEdit from './components/SpinEdit';

const Alert = MuiAlert;

const capitalizeFirstLetter = (text) => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = async () => {
    setLoading(true);
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = docs.docs.map((doc) => ({ name: doc.id, ...doc.data() }));
      setInventory(inventoryList);
    } catch (err) {
      setError('Error fetching inventory');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item) => {
    if (!item) {
      setError('Item name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      setSuccess('Item added successfully');
      updateInventory();
    } catch (err) {
      setError('Error adding item');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (item) => {
    setLoading(true);
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }
      setSuccess('Item removed successfully');
      updateInventory();
    } catch (err) {
      setError('Error removing item');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY; // Ensure this is set correctly
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${inventory.map(item => capitalizeFirstLetter(item.name)).join(',')}&apiKey=${apiKey}`;
    setLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length) {
        setRecipes(data);
      } else {
        setError('No recipes found');
      }
    } catch (err) {
      setError('Error fetching recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      sx={{
        '@media (max-width: 600px)': {
          p: 1,
        },
        '@media (min-width: 600px) and (max-width: 1200px)': {
          p: 2,
        },
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Pantry-Tracker
      </Typography>

      {/* Move alerts below the title */}
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
        <Button variant="contained" onClick={fetchRecipes}>
          Generate Recipes
        </Button>
      </Stack>

      <Stack direction="row" spacing={4} width="100%" maxWidth="1200px">
        <Box width="100%">
          <Typography variant="h6" textAlign="center" gutterBottom>
            Pantry Items
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Stack spacing={2}>
              {filteredInventory.length ? (
                filteredInventory.map((item, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={1}
                    bgcolor={index % 2 === 0 ? '#f5f5f5' : '#fff'}
                    borderRadius="4px"
                  >
                    <Typography variant="body1">{capitalizeFirstLetter(item.name)}</Typography>
                    <SpinEdit
                      value={item.quantity}
                      onChange={(newValue) => {
                        const updatedItem = { ...item, quantity: newValue };
                        setInventory((prev) =>
                          prev.map((i) => (i.name === item.name ? updatedItem : i))
                        );
                        // Update quantity in Firestore
                        addItem(item.name);
                      }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => removeItem(item.name)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography>No items found</Typography>
              )}
            </Stack>
          )}
        </Box>
      </Stack>

      {/* Recipes Section */}
      <Box
        width="100%"
        maxWidth="1200px"
        mt={4}
        p={2}
        borderRadius="8px"
        border="1px solid #333"
        bgcolor="#f9f9f9"
      >
        <Typography variant="h6" textAlign="center" mb={2}>
          Recipe Ideas
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {recipes.length ? (
              recipes.map((recipe, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    p={2}
                    borderRadius="4px"
                    bgcolor="#fff"
                    boxShadow="0 4px 8px rgba(0,0,0,0.1)"
                    textAlign="center"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                    />
                    <Typography variant="h6" fontWeight="bold" mt={1}>
                      {recipe.title}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {recipe.summary}
                    </Typography>
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography>No recipe ideas found</Typography>
            )}
          </Grid>
        )}
      </Box>

      <Box mt={4} p={2}>
        <Typography variant="body2" textAlign="center">
          © 2024 Modiehi Patience Malete
        </Typography>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
