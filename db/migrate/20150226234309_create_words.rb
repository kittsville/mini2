class CreateWords < ActiveRecord::Migration
  def change
    create_table :words do |t|
      t.string :word
      t.integer :wordtype
      t.text :description

      t.timestamps null: false
    end
  end
end
