const Show: React.FC<{
  component: React.ReactNode;
  when: boolean;
  fallback?: React.ReactNode;
}> = ({ component, when, fallback }) => {
  if (when) {
    return component;
  }

  if (fallback) {
    return fallback;
  }

  return null;
};

export default Show;
