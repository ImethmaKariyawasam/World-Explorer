import { render, screen, fireEvent, act } from '@testing-library/react';
import FavoriteButton from './FavoriteButton';
import { useAuth } from '../../context/AuthContext';

// Mock axios properly
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../context/AuthContext');

describe('FavoriteButton Component', () => {
  const mockUser = {
    favoriteCountries: ['CAN'],
  };
  const mockRefreshUser = jest.fn();
  
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: mockUser,
      refreshUser: mockRefreshUser,
    });
  });

  test('renders "Add to Favorites" when country is not favorite', () => {
    render(<FavoriteButton countryCode="USA" />);
    expect(screen.getByText('♡ Add to Favorites')).toBeInTheDocument();
  });

  test('renders "Remove Favorite" when country is favorite', () => {
    render(<FavoriteButton countryCode="CAN" />);
    expect(screen.getByText('❤️ Remove Favorite')).toBeInTheDocument();
  });

  test('calls API to add favorite when clicked', async () => {
    require('axios').default.post.mockResolvedValue({});
    
    render(<FavoriteButton countryCode="USA" />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(require('axios').default.post).toHaveBeenCalled();
  });
});