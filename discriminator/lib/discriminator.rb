require "rubygems"
require "bundler/setup"

require "eventmachine"
require "whatlanguage"

module Discriminator  
  def receive_data(data)
    send_data(data.language.to_s)
  end
end

EventMachine::run do
  host = '127.0.0.1'
  port = 20100
  EventMachine::start_server host, port, Discriminator
  puts "Started discriminator on #{host}:#{port}..."
end