
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  mails: [],
    loading: false,
  error: null,
};

export const deleteMail = createAsyncThunk(
  "mail/deleteMail",
  async ({ userId,folder, mailId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/${folder}/${mailId}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete mail");
      }

      return mailId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchInboxMails = createAsyncThunk(
  "mail/fetchInboxMails",
  async ({userId,folder}) => {
    const response = await fetch(
      `https://mailboxclient-9e998-default-rtdb.firebaseio.com/${userId}/${folder}.json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch mails");
    }

    const data = await response.json();

    if (!data) {
      return [];
    }

    const loadedMails = [];

    for (const key in data) {
      loadedMails.push({
        id: key,
        ...data[key],
      });
    }

    return loadedMails;
  }
);
const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
  markMailAsRead(state, action) {
    const mail = state.mails.find(
      (mail) => mail.id === action.payload
    );

    if (mail) {
      mail.isRead = true;
    }
  },
},
extraReducers: (builder) => {
  builder

    .addCase(fetchInboxMails.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(fetchInboxMails.fulfilled, (state, action) => {
      state.loading = false;
      state.mails = action.payload;
    })

    .addCase(fetchInboxMails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })

      .addCase(deleteMail.fulfilled, (state, action) => {
      state.mails = state.mails.filter(
        (mail) => mail.id !== action.payload
      );
    })

    .addCase(deleteMail.rejected, (state, action) => {
      state.error = action.payload || action.error.message;
    });
}
});
export const { markMailAsRead } = mailSlice.actions;

export default mailSlice.reducer;

