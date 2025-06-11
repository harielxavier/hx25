import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import UniversalImageManager from '../../components/admin/UniversalImageManager';

const ImageManager: React.FC = () => {
  return (
    <AdminLayout>
      <UniversalImageManager />
    </AdminLayout>
  );
};

export default ImageManager;
