// eslint-disable-next-line no-unused-vars
const doUserLogOut = async function (): Promise<boolean> {
  try {
    await Parse.User.logOut();
    // To verify that current user is now empty, currentAsync can be used
    const currentUser: Parse.User = await Parse.User.current();
    if (currentUser === null) {
      alert('Success! No user is logged in anymore!');
    }
    // Update state variable holding current user
    currentUser();
    return true;
  } catch (error: any) {
    alert(`Error! ${error.message}`);
    return false;
  }
};